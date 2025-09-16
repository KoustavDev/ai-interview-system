import { ApplicationRepository } from "../repositories/application.repository.js";
import { JobRepository } from "../repositories/job.repository.js";
import apiErrors from "../utils/errors/apiErrors.js";
import { Cache } from "../utils/redis/redisAction.js";

export class ApplicationService {
  static async createApplication(userId, candidateId, jobId, resumeId) {
    // Check if the job exists in the DB before applying
    const jobExists = await JobRepository.getJobById(jobId);

    if (!jobExists) throw new apiErrors(404, "Job not found");

    // Prevent duplicate application
    const alreadyApplied = await ApplicationRepository.checkAppliedApplication(
      jobId,
      candidateId
    );

    if (alreadyApplied)
      throw new apiErrors(400, "You have already applied for this job");

    // Create the application
    const application = await ApplicationRepository.createApplication(
      jobId,
      candidateId,
      resumeId
    );

    // Invalidate cache
    await Cache.del(`user:${userId}:job:${jobId}`);
    await Cache.del(`user:${userId}:job:applications:${jobId}`);
    await Cache.del(`user:${userId}:candidate:applied-jobs:${candidateId}`);
    await Cache.del(
      `user:${userId}:recruiter:dashboard:${jobExists.recruiterId}`
    );

    return application;
  }

  static async getApplicationsByJobId(userId, jobId, recruiterId) {
    // Step 1: Check in cache
    const cache = await Cache.get(`user:${userId}:job:applications:${jobId}`);

    if (cache) return cache;

    // Step 2: Check if job exists
    const job = await JobRepository.getJobById(jobId);

    if (!job) throw new apiErrors(404, "Job not found");

    // Check authorizaton
    if (job.recruiterId !== recruiterId)
      throw new apiErrors(
        403,
        "Not authorized to get applications of this job!"
      );

    // Step 3: Parallelized DB queries in one go using Promise.all
    const applications =
      await ApplicationRepository.getApplicationByJobId(jobId);

    if (!applications)
      throw new apiErrors(500, "Failed to fetch applications !");

    // Step 4:  Calculate counts using JS instead of DB
    let pendingCount = 0;
    let interviewedCount = 0;

    for (const app of applications) {
      if (app.status === "pending") pendingCount++;
      else if (app.status === "interviewed") interviewedCount++;
    }

    // Step 5: Cache it
    await Cache.set(
      `user:${userId}:job:applications:${jobId}`,
      {
        totalApplications: applications.length,
        pendingCount,
        interviewedCount,
        applications,
        jobTitle: job.title,
      },
      5 * 60
    );

    return {
      totalApplications: applications.length,
      pendingCount,
      interviewedCount,
      applications,
      jobTitle: job.title,
    };
  }

  static async shortListedApplication(userId, recruiterId) {
    // Step 1: Check the cache
    const cache = await Cache.get(
      `user:${userId}:recruiter:shortlisted:${recruiterId}`
    );

    if (cache) return cache;

    // Step 2: Get all job IDs created by this recruiter
    const jobs = await ApplicationRepository.recruitersJobPosts(recruiterId);

    const jobIds = jobs.map((job) => job.id);

    if (jobIds.length === 0) {
      await Cache.set(
        `user:${userId}:recruiter:shortlisted:${recruiterId}`,
        {
          totalApplications: 0,
          interviewedApplications: [],
          shortlistedCount: 0,
          rejectedCount: 0,
        },
        10 * 60
      );

      return {
        totalApplications: 0,
        interviewedApplications: [],
        shortlistedCount: 0,
        rejectedCount: 0,
      };
    }

    // Step 3: Get all applications with status = interviewed
    const interviewedApplications =
      await ApplicationRepository.getInterviewedApplications(jobIds);

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

    await Cache.set(
      `user:${userId}:recruiter:shortlisted:${recruiterId}`,
      {
        totalApplications: interviewedApplications.length,
        shortlistedCount,
        rejectedCount,
        interviewedApplications: finalApplicationlist,
      },
      10 * 60
    );

    return {
      totalApplications: interviewedApplications.length,
      shortlistedCount,
      rejectedCount,
      interviewedApplications: finalApplicationlist,
    };
  }

  static async updateApplicationStatus(
    userId,
    recruiterId,
    applicationId,
    status
  ) {
    // Step 1: Check if application exists
    const existingApplication =
      await ApplicationRepository.getApplicationById(applicationId);

    if (!existingApplication) throw new apiErrors(404, "Application not found");

    // Step 2: Check recruiter is authorized or not
    if (existingApplication.job.recruiterId !== recruiterId)
      throw new apiErrors(
        403,
        "You are not authorized to change application status!"
      );

    // Step 3: Update the status
    const updatedApplication =
      await ApplicationRepository.updateApplicationStatus(
        applicationId,
        status
      );

    // Step 4: Invalidate cache
    await Cache.del(`user:${userId}:recruiter:shortlisted:${recruiterId}`);
    await Cache.del(`user:${userId}:report:${applicationId}`);

    return updatedApplication;
  }

  static async appliedJobs(userId, candidateId) {
    // Step 1: Check from cache
    const cache = await Cache.get(
      `user:${userId}:candidate:applied-jobs:${candidateId}`
    );

    if (cache) return cache;

    // Step 2: Fetch all applications of this candidate
    const applications = await ApplicationRepository.getAllCandidateApplications(candidateId);

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

    await Cache.set(
      `user:${userId}:candidate:applied-jobs:${candidateId}`,
      {
        totalApplications: applications.length,
        statusCounts,
        applications: enhancedApplications,
      },
      15 * 60
    );

    return {
      totalApplications: applications.length,
      statusCounts,
      applications: enhancedApplications,
    };
  }
}
