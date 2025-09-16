import asyncHandler from "../utils/helpers/asyncHandler.js";
import apiErrors from "../utils/errors/apiErrors.js";
import apiSuccess from "../utils/errors/apiSuccess.js";
import {
  getJobsQuerySchema,
  jobPostingSchema,
} from "../validator/job.validator.js";
import formatZodError from "../utils/formatters/zodErrorFormater.js";
import { JobService } from "../services/job.service.js";

export const createJob = asyncHandler(async (req, res) => {
  // Validate request body
  const result = jobPostingSchema.safeParse();

  if (!result.success) throw new apiErrors(400, formatZodError(result.error));

  // If valid, destructure safe data
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
  } = result.data;

  const newJob = await JobService.createJob(
    req.user.id,
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

  return res
    .status(200)
    .json(new apiSuccess(200, newJob, "Job created successfully"));
});

export const getAllJobs = asyncHandler(async (req, res) => {
  const result = getJobsQuerySchema.safeParse(req.query);

  if (!result.success) {
    throw new apiErrors(400, formatZodError(result.error));
  }

  // Destructure query parameters
  const { page, limit, query, sortBy, sortType, recruiterName } = result.data;
  const candidateId = req.user?.candidateProfile?.id;

  // Get paginated job posts
  const jobPosts = await JobService.getPaginatedJobs(
    candidateId,
    page,
    limit,
    query,
    sortBy,
    sortType,
    recruiterName
  );

  if (jobPosts.jobsWithIsApplied.length === 0) {
    return res
      .status(200)
      .json(
        new apiSuccess(200, jobPosts, "No jobs found for given recruiter name")
      );
  } else {
    return res
      .status(200)
      .json(new apiSuccess(200, jobPosts, "Jobs fetched successfully"));
  }
});

export const getJobById = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const candidateId = req.user?.candidateProfile?.id;

  // Validate job ID
  if (!jobId) {
    throw new apiErrors(400, "Job ID is required");
  }

  const job = await JobService.getJobById(req.user.id, jobId, candidateId);

  // Respond with the job details
  return res
    .status(200)
    .json(new apiSuccess(200, job, "Job fetched successfully"));
});
