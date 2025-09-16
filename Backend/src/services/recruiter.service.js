import { RecruiterRepository } from "../repositories/recruiter.repository.js";
import { UserRepository } from "../repositories/user.repository.js";
import apiErrors from "../utils/errors/apiErrors.js";
import { publicUrl } from "../utils/helpers/getPublicS3Url.js";
import { Cache } from "../utils/redis/redisAction.js";

export class RecruiterService {
  static async updateProfile(
    id,
    avatar,
    recruiterId,
    companyName,
    position,
    contactNumber,
    about
  ) {
    // Update avatar
    if (avatar) {
      const publicAvatarUrl = publicUrl(id, "avatar", avatar);

      // Update avatar
      const updatedUser = await UserRepository.updateAvatar(
        id,
        publicAvatarUrl
      );

      if (!updatedUser)
        throw new apiErrors(500, "Failed to update avatar image");
    }

    // Find recruiter ID
    const finalRecruiterId = recruiterId || id;

    if (!finalRecruiterId) {
      throw new apiErrors(400, "Recruiter profile ID is missing.");
    }
    // Update profile
    const updatedProfile = await RecruiterRepository.updateProfile(
      finalRecruiterId,
      companyName,
      position,
      contactNumber,
      about
    );

    if (!updatedProfile)
      throw new apiErrors(500, "Recruiter profile updation is failed.");

    // Invalodate profile cache
    await Cache.del(`profile:${req.user.id}`);

    return updatedProfile;
  }

  static async dashboard(userId, recruiterId) {
    // Search in cache
    const cache = await Cache.get(
      `user:${userId}:recruiter:dashboard:${recruiterId}`
    );

    // If present then send it
    if (cache) return cache;

    // Fetch job posts
    const jobs = await RecruiterRepository.recruiterJobs(recruiterId);

    if (!jobs) throw new apiErrors(500, "Failed to fetch job posts!");

    // Calculate total applications in JS from the same query result
    const totalApplications = jobs.reduce(
      (sum, job) => sum + job._count.applications,
      0
    );

    const averageApplication =
      jobs.length > 0 ? Math.ceil(totalApplications / jobs.length) : 0;

    // Cache it
    await Cache.set(
      `user:${userId}:recruiter:dashboard:${recruiterId}`,
      { jobs, totalApplications, averageApplication },
      15 * 60
    );

    return { jobs, totalApplications, averageApplication };
  }
}
