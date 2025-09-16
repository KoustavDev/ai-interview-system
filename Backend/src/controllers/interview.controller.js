import asyncHandler from "../utils/helpers/asyncHandler.js";
import apiErrors from "../utils/errors/apiErrors.js";
import apiSuccess from "../utils/errors/apiSuccess.js";
import { sendMessageSchema } from "../validator/interview.validator.js";
import formatZodError from "../utils/formatters/zodErrorFormater.js";
import { InterviewService } from "../services/interview.service.js";

export const startInterview = asyncHandler(async (req, res) => {
  // Collect payloads
  const { applicationId } = req.body;

  if (!applicationId) throw new apiErrors(400, "All fields are required !");

  const initialInterviewData =
    await InterviewService.startInterview(applicationId);

  return res
    .status(201)
    .json(
      new apiSuccess(
        201,
        initialInterviewData,
        "Candidate applications fetched successfully"
      )
    );
});

export const sendMessage = asyncHandler(async (req, res) => {
  const validation = sendMessageSchema.safeParse(req.body);

  if (!validation.success) {
    throw new apiErrors(400, formatZodError(validation.error));
  }

  const { interviewId, message } = validation.data;

  const aiResponse = await InterviewService.sendMessage(interviewId, message);

  return res
    .status(200)
    .json(new apiSuccess(200, aiResponse, "Response generated successfully"));
});

export const generateInterviewReport = asyncHandler(async (req, res) => {
  const { interviewId } = req.body;

  if (!interviewId) throw new apiErrors(400, "Interview ID is not provided !");

  const report = await InterviewService.generateReport(interviewId);

  res.status(201).json(new apiSuccess(201, report, "Report is generated !"));
});

export const deleteInterview = asyncHandler(async (req, res) => {
  const { interviewId } = req.query;

  if (!interviewId) throw new apiErrors(400, "Interview id is missing!");

  await InterviewService.deleteInterview(interviewId);

  res.status(200).json(new apiSuccess(200, {}, "Interview is deleted !"));
});

export const getReport = asyncHandler(async (req, res) => {
  const { applicationId } = req.query;

  if (!applicationId) throw new apiErrors(400, "Application id is needed !");

  const report = await InterviewService.getReport(
    req.user.id,
    req.user.recruiterProfile.id,
    applicationId
  );

  return res
    .status(200)
    .json(new apiSuccess(200, report, "Report is fetched successfully !"));
});
