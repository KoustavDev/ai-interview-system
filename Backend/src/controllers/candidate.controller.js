import asyncHandler from "../utils/helpers/asyncHandler.js";
import apiErrors from "../utils/errors/apiErrors.js";
import apiSuccess from "../utils/errors/apiSuccess.js";
import { resumeUploadSchema } from "../validator/user.validator.js";
import { CandidateService } from "../services/candidate.service.js";


export const resumeUploadUrl = asyncHandler(async (req, res) => {
  const result = resumeUploadSchema.safeParse(req.body);

  if (!result.success) {
    throw new apiErrors(400, result.error.issues[0].message);
  }

  const { fileName, fileType } = result.data;

  // Get Upload URL
  const url = await CandidateService.resumeUploadUrl(req.user.id, fileName);

  return res
    .status(200)
    .json(
      new apiSuccess(
        200,
        { uploadUrl: url },
        "Upload URL generated successfully!"
      )
    );
});

export const updateCandidateProfile = asyncHandler(async (req, res) => {
  const {
    avatar,
    candidateId,
    education,
    experience,
    skills,
    about,
    resumeUrl,
  } = req.body;

  const updatedProfile = await CandidateService.updateProfile(
    req.user.id,
    avatar,
    candidateId,
    education,
    experience,
    skills,
    about,
    resumeUrl
  );

  return res
    .status(200)
    .json(
      new apiSuccess(
        200,
        updatedProfile,
        "Candidate profile updated successfully"
      )
    );
});
