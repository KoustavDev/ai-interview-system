import { JobRepository } from "../repositories/job.repository.js";
import apiErrors from "../utils/errors/apiErrors.js";
import { Cache } from "../utils/redis/redisAction.js";

export class JobService {
  static async createJob(
    userId,
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
    requirement
  ) {
    // Check if recruiter exists
    const recruiter = await JobRepository.findRecruiterById(recruiterId);

    if (!recruiter) throw new apiErrors(404, "Recruiter not found");

    // Create job
    const newJob = await JobRepository.createJob(
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
      requirement
    );

    if (!newJob) throw new apiErrors(500, "Failed to create job post !");

    // Invalidate recruiter dashboard cache
    await Cache.del(`user:${userId}:recruiter:dashboard:${recruiterId}`);

    return newJob;
  }

  static async getPaginatedJobs(
    candidateId,
    page,
    limit,
    query,
    sortBy,
    sortType,
    recruiterName
  ) {
    const skip = (page - 1) * limit;

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
      const matchedUsers =
        await JobRepository.findRecruitersByName(recruiterName);

      // Extract valid recruiter profile IDs
      const recruiterIds = matchedUsers
        .map((user) => user.recruiterProfile?.id)
        .filter(Boolean); // remove null/undefined

      // If no recruiter profiles match the name
      if (!recruiterIds.length) {
        return {
          currentPage: page,
          totalPages: 0,
          totalJobs: 0,
          jobsWithIsApplied: [],
        };
      }
      filter.recruiterId = { in: recruiterIds };
    }

    // Fetch total job count and paginated job list
    const [totalJobs, jobs] = await JobRepository.paginatedJobs(
      filter,
      sortBy,
      sortType,
      limit,
      skip
    );

    // Only check applied jobs if user is a candidate
    let appliedJobIds = new Set();

    if (candidateId) {
      const applications = await JobRepository.appliedJobs(candidateId);
      appliedJobIds = new Set(applications.map((app) => app.jobId));
    }

    // Add isApplied to each job
    const jobsWithIsApplied = jobs.map((job) => ({
      ...job,
      isApplied: appliedJobIds.has(job.id),
    }));

    return {
      currentPage: page,
      totalPages: Math.ceil(totalJobs / limit),
      totalJobs,
      jobsWithIsApplied,
    };
  }

  static async getJobById(userId, jobId, candidateId) {
    // Search is cache
    const cache = await Cache.get(`user:${userId}:job:${jobId}`);

    // If present then send it
    if (cache) return cache;

    // Fetch job by ID along with recruiter info, their user profile and applications
    const job = await JobRepository.fetchFullJobDetails(jobId, candidateId);

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

    // Cache it
    await Cache.set(
      `user:${userId}:job:${jobId}`,
      { ...job, isApplied, status },
      10 * 60
    );

    return { ...job, isApplied, status };
  }
}
