import { PutObjectCommand } from "@aws-sdk/client-s3";
import apiErrors from "../utils/errors/apiErrors.js";
import { publicUrl } from "../utils/helpers/getPublicS3Url.js";
import { Cache } from "../utils/redis/redisAction.js";
import { s3Client } from "../index.js";
import { UserRepository } from "../repositories/user.repository.js";
import { CadidateRepository } from "../repositories/candidate.repository.js";

export class CandidateService {
  static async resumeUploadUrl(userId, fileName) {
    // Get Upload URL
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${userId}/resume/${fileName}`,
      ContentType: fileType,
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 600 }); // Valid for 10 min

    return url;
  }

  static async updateCandidateProfile(
    userId,
    avatar,
    candidateId,
    education,
    experience,
    skills,
    about,
    resumeUrl
  ) {
    if (avatar) {
      const publicAvatarUrl = publicUrl(userId, "avatar", avatar);

      // Update avatar
      const updatedUser = await UserRepository.updateAvatar(
        userId,
        publicAvatarUrl
      );

      if (!updatedUser)
        throw new apiErrors(500, "Failed to update avatar image");
    }

    const finalCandidateId = candidateId || userId;

    if (!finalCandidateId) {
      throw new apiErrors(400, "Candidate profile ID is missing.");
    }

    // Update or create Resume if resumeUrl is provided
    if (resumeUrl) {
      const existingResume =
        await CadidateRepository.existingResume(finalCandidateId);

      const publicResumeUrl = publicUrl(req.user.id, "resume", resumeUrl);

      if (existingResume) {
        await CadidateRepository.updateResume(
          finalCandidateId,
          publicResumeUrl
        );
      } else {
        await CadidateRepository.createResume(
          finalCandidateId,
          publicResumeUrl
        );
      }
    }

    // Update Candidate Profile
    const updatedProfile = await CandidateService.updateProfile(
      finalCandidateId,
      education,
      experience,
      skills,
      about
    );

    if (!updatedProfile)
      throw new apiErrors(500, "Failed to update candidate profile.");

    // Invalodate profile cache
    await Cache.del(`profile:${userId}`);

    return updatedProfile;
  }
}
