import asyncHandler from "../utils/helpers/asyncHandler.js";
import apiErrors from "../utils/errors/apiErrors.js";
import apiSuccess from "../utils/errors/apiSuccess.js";
import { updateApplicationStatusSchema } from "../validator/application.validatoe.js";
import formatZodError from "../utils/formatters/zodErrorFormater.js";
import { ApplicationService } from "../services/application.service.js";

export const createApplication = asyncHandler(async (req, res) => {
  const { jobId } = req.body;

  // Step 1: Validate jobId
  if (!jobId) throw new apiErrors(400, "Job ID is required");

  // Step 2: Extract candidate and resume IDs from authenticated user
  const candidateId = req.user?.candidateProfile?.id;
  const resumeId = req.user?.candidateProfile?.resumes?.id;

  if (!candidateId || !resumeId)
    throw new apiErrors(400, "Candidate profile or resume not found");

  // Step 3: Create the application
  const application = await ApplicationService.createApplication(
    req.user.id,
    candidateId,
    resumeId
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

  // Step 2: Get applications
  const application = await ApplicationService.getApplicationsByJobId(
    req.user.id,
    jobId,
    req.user.recruiterProfile.id
  );

  // Step 3: Send response
  return res
    .status(200)
    .json(
      new apiSuccess(200, application, "Applications fetched successfully")
    );
});

export const getInterviewedApplicationsByRecruiter = asyncHandler(
  async (req, res) => {
    const recruiterId = req.user?.recruiterProfile.id;

    // Step 1: Validate recruiterId
    if (!recruiterId)
      throw new apiErrors(400, "Recruiter ID is required in body");

    // Step 2: Call application service and get data
    const shortlistedApplications =
      await ApplicationService.shortListedApplication(
        req.user.id,
        req.user.recruiterProfile.id
      );

    // Step 2: Send final response
    return res
      .status(200)
      .json(
        new apiSuccess(
          200,
          shortlistedApplications,
          "Interviewed applications fetched successfully"
        )
      );
  }
);

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  // Step 1: Validate input
  const result = updateApplicationStatusSchema.safeParse(req.body);

  if (!result.success) {
    throw new apiErrors(400, formatZodError(result.error));
  }

  // If valid, destructure safe data
  const { applicationId, status } = result.data;

  // Step 2: Update the application status
  const application = await ApplicationService.updateApplicationStatus(
    req.user.id,
    req.user?.recruiterProfile.id,
    applicationId,
    status
  );

  // Step 3: Return success response
  return res.status(200).json(
    new apiSuccess(
      200,
      {
        application,
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

  const appliedJobs = await ApplicationService.appliedJobs(req.user.id, candidateId);

  // Step 5: Send response
  return res.status(200).json(
    new apiSuccess(
      200,
      appliedJobs,
      "Candidate applications fetched successfully"
    )
  );
});
