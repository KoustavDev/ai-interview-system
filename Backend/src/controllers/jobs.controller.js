import asyncHandler from "../utils/asyncHandler.js";
import apiErrors from "../utils/apiErrors.js";
import apiSuccess from "../utils/apiSuccess.js";
import prisma from "../lib/prisma.js";

export const createJob = asyncHandler(async (req, res) => {
  const {
    recruiterId,
    title,
    type,
    salary,
    description,
    skillsRequired,
    experience,
    location,
    deadline,
    responsibility,
    benefits,
    requirement,
  } = req.body;

  // Basic validation
  if (
    !recruiterId ||
    !title ||
    !type ||
    !salary ||
    !description ||
    !experience ||
    !skillsRequired?.length ||
    !responsibility?.length ||
    !benefits?.length ||
    !requirement?.length
  ) {
    throw new apiErrors(400, "Missing required job fields");
  }

  // Check if recruiter exists
  const recruiter = await prisma.recruiterProfile.findUnique({
    where: { id: recruiterId },
  });

  if (!recruiter) throw new apiErrors(404, "Recruiter not found");

  // Create job
  const newJob = await prisma.job.create({
    data: {
      recruiterId,
      title,
      type,
      salary,
      description,
      skillsRequired,
      experience,
      location,
      deadline: deadline ? new Date(deadline) : undefined,
      responsibility,
      benefits,
      requirement,
    },
  });

  if (!newJob) throw new apiErrors(500, "Failed to create job post !");

  return res
    .status(200)
    .json(new apiSuccess(200, newJob, "Job created successfully"));
});

export const getAllJobs = asyncHandler(async (req, res) => {
  // Destructure query parameters with default values
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
    recruiterName,
  } = req.query;

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const candidateId = req.user?.candidateProfile?.id;

  // Validate pagination parameters
  if (
    isNaN(pageNumber) ||
    isNaN(limitNumber) ||
    pageNumber < 1 ||
    limitNumber < 1
  ) {
    throw new apiErrors(
      400,
      "Page and limit must be positive integers greater than 0"
    );
  }

  const skip = (pageNumber - 1) * limitNumber;

  const filter = {}; // Base filter object for Prisma query

  // Search title or description
  if (query) {
    filter.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  // Filter by recruiter name (indirect)
  if (recruiterName) {
    const matchedUsers = await prisma.user.findMany({
      where: {
        name: {
          contains: recruiterName,
          mode: "insensitive",
        },
      },
      include: {
        recruiterProfile: true,
      },
    });

    // Extract valid recruiter profile IDs
    const recruiterIds = matchedUsers
      .map((user) => user.recruiterProfile?.id)
      .filter(Boolean); // remove null/undefined

    // If no recruiter profiles match the name
    if (!recruiterIds.length) {
      return res.status(200).json(
        new apiSuccess(
          200,
          {
            currentPage: pageNumber,
            totalPages: 0,
            totalJobs: 0,
            jobs: [],
          },
          "No jobs found for given recruiter name"
        )
      );
    }
  }

  // Fetch total job count and paginated job list
  const [totalJobs, jobs] = await Promise.all([
    prisma.job.count({ where: filter }),
    prisma.job.findMany({
      where: filter,
      orderBy: {
        [sortBy]: sortType === "asc" ? "asc" : "desc",
      },
      skip,
      take: limitNumber,
      include: {
        recruiter: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    }),
  ]);

  // Only check applied jobs if user is a candidate
  let appliedJobIds = new Set();

  if (candidateId) {
    const applications = await prisma.application.findMany({
      where: { candidateId },
      select: { jobId: true },
    });

    appliedJobIds = new Set(applications.map((app) => app.jobId));
  }

  // Add isApplied to each job
  const jobsWithIsApplied = jobs.map((job) => ({
    ...job,
    isApplied: appliedJobIds.has(job.id),
  }));

  // Respond with paginated job data
  return res.status(200).json(
    new apiSuccess(
      200,
      {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalJobs / limitNumber),
        totalJobs,
        jobsWithIsApplied,
      },
      "Jobs fetched successfully"
    )
  );
});

export const getJobById = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const candidateId = req.user?.candidateProfile?.id;

  // Validate job ID
  if (!jobId) {
    throw new apiErrors(400, "Job ID is required");
  }

  // Fetch job by ID along with recruiter info, their user profile and applications
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      recruiter: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      },
      applications: {
        where: {
          candidateId: candidateId || "", // prevent error if candidateId is undefined
        },
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  // If no job is found, return 404
  if (!job) {
    throw new apiErrors(404, "Job not found");
  }

  // Determine if candidate has applied
  const isApplied = job.applications.length > 0;
  let status = null;
  if (candidateId) status = job.applications[0]?.status;
  // Remove the applications array from response if you don't want to expose it
  // delete job.applications;

  // Respond with the job details
  return res
    .status(200)
    .json(
      new apiSuccess(
        200,
        { ...job, isApplied, status },
        "Job fetched successfully"
      )
    );
});
