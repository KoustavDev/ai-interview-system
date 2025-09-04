import asyncHandler from "../utils/asyncHandler.js";
import apiErrors from "../utils/apiErrors.js";
import apiSuccess from "../utils/apiSuccess.js";
import prisma from "../lib/prisma.js";
import { redisClient } from "../index.js";

export const createApplication = asyncHandler(async (req, res) => {
  const { jobId } = req.body;

  // Step 1: Validate jobId
  if (!jobId) throw new apiErrors(400, "Job ID is required");

  // Step 2: Extract candidate and resume IDs from authenticated user
  const candidateId = req.user?.candidateProfile?.id;
  const resumeId = req.user?.candidateProfile?.resumes?.id;

  if (!candidateId || !resumeId)
    throw new apiErrors(400, "Candidate profile or resume not found");

  // Check if the job exists in the DB before applying
  const jobExists = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!jobExists) throw new apiErrors(404, "Job not found");

  // Prevent duplicate application
  const alreadyApplied = await prisma.application.findFirst({
    where: {
      jobId,
      candidateId,
    },
  });

  if (alreadyApplied)
    throw new apiErrors(400, "You have already applied for this job");

  // Step 3: Create the application
  const application = await prisma.application.create({
    data: {
      jobId,
      candidateId,
      resumeId,
    },
    include: {
      job: true,
      resume: true,
    },
  });

  await redisClient.del(`user:${req.user.id}:job:${jobId}`);
  await redisClient.del(`user:${req.user.id}:job:applications:${jobId}`);
  await redisClient.del(
    `user:${req.user.id}:candidate:applied-jobs:${candidateId}`
  );
  await redisClient.del(
    `user:${req.user.id}:recruiter:dashboard:${jobExists.recruiterId}`
  );

  // Step 4: Send success response
  return res
    .status(201)
    .json(
      new apiSuccess(201, application, "Application submitted successfully")
    );
});

export const getApplicationsByJobId = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  // Step 1: Validate jobId
  if (!jobId) throw new apiErrors(400, "Job ID is required in query");

  // Step 2: Check in cache
  const cache = await redisClient.get(
    `user:${req.user.id}:job:applications:${jobId}`
  );

  if (cache) {
    const cachedApplication = JSON.parse(cache);
    return res
      .status(200)
      .json(
        new apiSuccess(
          200,
          cachedApplication,
          "Applications fetched successfully"
        )
      );
  }
  // Step 3: Check if job exists
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) throw new apiErrors(404, "Job not found");

  // TODO: if job.recruiterId !== req.recruiterPrifile.id then send 403 unauthorise code.
  if (job.recruiterId !== req.user.recruiterProfile.id)
    throw new apiErrors(403, "Not authorized to get applications of this job!");

  // Step 4: Parallelized DB queries in one go using Promise.all
  const applications = await prisma.application.findMany({
    where: { jobId },
    include: {
      job: {
        select: {
          title: true,
        },
      },
      candidate: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      },
      resume: {
        select: { fileUrl: true },
      },
      interview: {
        include: {
          report: {
            select: { score: true },
          },
        },
      },
    },
    orderBy: {
      appliedAt: "desc",
    },
  });

  if (!applications) throw new apiErrors(500, "Failed to fetch applications !");

  const jobTitle = await prisma.job.findUnique({
    where: { id: jobId },
    select: { title: true },
  });

  // Step 5:  Calculate counts using JS instead of DB
  let pendingCount = 0;
  let interviewedCount = 0;

  for (const app of applications) {
    if (app.status === "pending") pendingCount++;
    else if (app.status === "interviewed") interviewedCount++;
  }

  // Step 6: Cache it
  await redisClient.set(
    `user:${req.user.id}:job:applications:${jobId}`,
    JSON.stringify({
      totalApplications: applications.length,
      pendingCount,
      interviewedCount,
      applications,
      jobTitle,
    }),
    "EX",
    5 * 60
  );

  // Step 7: Send response
  return res.status(200).json(
    new apiSuccess(
      200,
      {
        totalApplications: applications.length,
        pendingCount,
        interviewedCount,
        applications,
        jobTitle,
      },
      "Applications fetched successfully"
    )
  );
});

export const getInterviewedApplicationsByRecruiter = asyncHandler(
  async (req, res) => {
    const recruiterId = req.user?.recruiterProfile.id;

    // Step 1: Validate recruiterId
    if (!recruiterId)
      throw new apiErrors(400, "Recruiter ID is required in body");

    const cache = await redisClient.get(
      `user:${req.user.id}:recruiter:shortlisted:${req.user.recruiterProfile.id}`
    );

    if (cache) {
      const cachedApplications = JSON.parse(cache);
      return res
        .status(200)
        .json(
          new apiSuccess(
            200,
            cachedApplications,
            "Interviewed applications fetched successfully"
          )
        );
    }

    // Step 2: Get all job IDs created by this recruiter
    const jobs = await prisma.job.findMany({
      where: {
        recruiterId,
      },
      select: {
        id: true,
      },
    });

    const jobIds = jobs.map((job) => job.id);

    if (jobIds.length === 0) {
      await redisClient.set(
        `user:${req.user.id}:recruiter:shortlisted:${req.user.recruiterProfile.id}`,
        JSON.stringify({
          totalApplications: 0,
          interviewedApplications: [],
          shortlistedCount: 0,
          rejectedCount: 0,
        }),
        "EX",
        10 * 60
      );

      return res.status(200).json(
        apiSuccess(200, "No jobs found for this recruiter", {
          totalApplications: 0,
          interviewedApplications: [],
          shortlistedCount: 0,
          rejectedCount: 0,
        })
      );
    }

    // Step 3: Get all applications with status = interviewed
    const interviewedApplications = await prisma.application.findMany({
      where: {
        jobId: { in: jobIds },
        status: { in: ["shortlisted", "rejected", "interviewed"] },
      },
      include: {
        candidate: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        job: {
          select: {
            title: true,
          },
        },
        interview: {
          include: {
            report: {
              select: { score: true },
            },
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
    });

    if (!interviewedApplications)
      throw new apiErrors(500, "Failed to fetch applications !");

    // Step 4: Count shortlisted and rejected applications
    let shortlistedCount = 0;
    let rejectedCount = 0;

    const finalApplicationlist = [];
    for (const application of interviewedApplications) {
      if (application.status === "interviewed")
        finalApplicationlist.push(application);
      else if (application.status === "shortlisted") shortlistedCount++;
      else rejectedCount++;
    }

    await redisClient.set(
      `user:${req.user.id}:recruiter:shortlisted:${req.user.recruiterProfile.id}`,
      JSON.stringify({
        totalApplications: interviewedApplications.length,
        shortlistedCount,
        rejectedCount,
        interviewedApplications: finalApplicationlist,
      }),
      "EX",
      10 * 60
    );

    // Step 5: Send final response
    return res.status(200).json(
      new apiSuccess(
        200,
        {
          totalApplications: interviewedApplications.length,
          shortlistedCount,
          rejectedCount,
          interviewedApplications: finalApplicationlist,
        },
        "Interviewed applications fetched successfully"
      )
    );
  }
);

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { applicationId, status } = req.body;

  // Step 1: Validate input
  if (!applicationId || !status)
    throw new apiErrors(400, "applicationId and status are required");

  // Validate if status is a valid enum
  const validStatuses = ["pending", "shortlisted", "rejected", "interviewed"];
  if (!validStatuses.includes(status)) {
    throw new apiErrors(
      400,
      `Invalid status. Must be one of: ${validStatuses.join(", ")}`
    );
  }

  // Step 2: Check if application exists
  const existingApplication = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        select: { recruiterId: true },
      },
    },
  });

  if (!existingApplication) throw new apiErrors(404, "Application not found");

  // TODO: if application.job.recruiterId !== req.recruiterPrifile.id then send 409 unauthorise code.
  if (existingApplication.job.recruiterId !== req.user.recruiterProfile.id)
    throw new apiErrors(
      403,
      "You are not authorize to change application status!"
    );
  // Step 3: Update the status
  const updatedApplication = await prisma.application.update({
    where: { id: applicationId },
    data: { status },
  });

  await redisClient.del(
    `user:${req.user.id}:recruiter:shortlisted:${req.user.recruiterProfile.id}`
  );
  await redisClient.del(`user:${req.user.id}:report:${applicationId}`);

  // Step 4: Return success response
  return res.status(200).json(
    new apiSuccess(
      200,
      {
        application: updatedApplication,
      },
      "Application status updated successfully"
    )
  );
});

export const getCandidateApplications = asyncHandler(async (req, res) => {
  const candidateId = req.user?.candidateProfile?.id;

  // Step 1: Validate candidate ID
  if (!candidateId)
    throw new apiErrors(400, "Candidate ID not found in user profile");

  const cache = await redisClient.get(
    `user:${req.user.id}:candidate:applied-jobs:${candidateId}`
  );

  if (cache) {
    const cachedApplications = JSON.parse(cache);
    return res
      .status(200)
      .json(
        new apiSuccess(
          200,
          cachedApplications,
          "Candidate applications fetched successfully"
        )
      );
  }

  // Step 2: Fetch all applications of this candidate
  const applications = await prisma.application.findMany({
    where: { candidateId },
    include: {
      job: {
        include: {
          recruiter: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    orderBy: {
      appliedAt: "desc",
    },
  });

  // Step 3: Enhance each application with recruiter info if status is shortlisted
  const enhancedApplications = applications.map((app) => {
    const base = {
      id: app.id,
      status: app.status,
      appliedAt: app.appliedAt,
      job: {
        id: app.job.id,
        title: app.job.title,
        location: app.job.location,
        type: app.job.type,
        salary: app.job.salary,
        company: app.job.recruiter.companyName,
      },
    };

    if (app.status === "shortlisted" && app.job.recruiter?.user) {
      base.recruiter = {
        name: app.job.recruiter.user.name,
        email: app.job.recruiter.user.email,
        contactNumber: app.job.recruiter.contactNumber,
      };
    }

    return base;
  });

  // Step 4: Count applications by status (JS logic to avoid multiple DB calls)
  let statusCounts = {
    pending: 0,
    interviewed: 0,
    shortlisted: 0,
    rejected: 0,
  };

  for (const app of applications) {
    if (statusCounts.hasOwnProperty(app.status)) {
      statusCounts[app.status]++;
    }
  }

  await redisClient.set(
    `user:${req.user.id}:candidate:applied-jobs:${candidateId}`,
    JSON.stringify({
      totalApplications: applications.length,
      statusCounts,
      applications: enhancedApplications,
    }),
    "EX",
    15 * 60
  );

  // Step 5: Send response
  return res.status(200).json(
    new apiSuccess(
      200,
      {
        totalApplications: applications.length,
        statusCounts,
        applications: enhancedApplications,
      },
      "Candidate applications fetched successfully"
    )
  );
});
