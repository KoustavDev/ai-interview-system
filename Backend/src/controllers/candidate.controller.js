import asyncHandler from "../utils/asyncHandler.js";
import apiErrors from "../utils/apiErrors.js";
import apiSuccess from "../utils/apiSuccess.js";
import prisma from "../lib/prisma.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { redisClient, s3Client } from "../index.js";
import { publicUrl } from "../services/getPublicS3Url.js";
import { resumeUploadSchema } from "../validator/user.validator.js";

export const getCandidateProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) throw new apiErrors(400, "User id is needed !");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { candidateProfile: { include: { resumes: true } } },
  });

  if (!user) throw new apiErrors(500, "Failed to fetch recruiter data");

  return res
    .status(200)
    .json(new apiSuccess(200, user, "Recruiter profile fetched successfully"));
});

export const resumeUploadUrl = asyncHandler(async (req, res) => {
  const result = resumeUploadSchema.safeParse(req.body);

  if (!result.success) {
    throw new apiErrors(400, result.error.issues[0].message);
  }

  const { fileName, fileType } = result.data;

  // Get Upload URL
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${req.user.id}/resume/${fileName}`,
    ContentType: fileType,
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn: 600 }); // Valid for 10 min

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

  if (avatar) {
    const publicAvatarUrl = publicUrl(req.user.id, "avatar", avatar);

    // Update avatar
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        avatar: publicAvatarUrl || undefined,
      },
    });

    if (!updatedUser) throw new apiErrors(500, "Failed to update avatar image");
  }

  const finalCandidateId = candidateId || req.user?.candidateProfile?.id;

  if (!finalCandidateId) {
    throw new apiErrors(400, "Candidate profile ID is missing.");
  }

  // Update or create Resume if resumeUrl is provided
  if (resumeUrl) {
    const existingResume = await prisma.resume.findUnique({
      where: { candidateId: finalCandidateId },
    });

    const publicResumeUrl = publicUrl(req.user.id, "resume", resumeUrl);

    if (existingResume) {
      await prisma.resume.update({
        where: { candidateId: finalCandidateId },
        data: { fileUrl: publicResumeUrl },
      });
    } else {
      await prisma.resume.create({
        data: {
          candidateId: finalCandidateId,
          fileUrl: publicResumeUrl,
        },
      });
    }
  }

  // Update Candidate Profile
  const updatedProfile = await prisma.candidateProfile.update({
    where: { id: finalCandidateId },
    data: {
      education: education || undefined,
      experience: experience || undefined,
      about: about || undefined,
      skills: Array.isArray(skills) ? skills : undefined,
    },
  });

  if (!updatedProfile)
    throw new apiErrors(500, "Failed to update candidate profile.");

  // Invalodate profile cache
  await redisClient.del(`profile:${req.user.id}`);

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

