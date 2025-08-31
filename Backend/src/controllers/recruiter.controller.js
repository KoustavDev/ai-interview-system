import asyncHandler from "../utils/asyncHandler.js";
import apiErrors from "../utils/apiErrors.js";
import apiSuccess from "../utils/apiSuccess.js";
import prisma from "../lib/prisma.js";
import { publicUrl } from "../services/getPublicS3Url.js";
import { redisClient } from "../index.js";

export const getRecruiterProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) throw new apiErrors(400, "User id is needed !");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { recruiterProfile: true },
  });

  if (!user) throw new apiErrors(500, "Failed to fetch recruiter data!");

  return res
    .status(200)
    .json(new apiSuccess(200, user, "Recruiter profile fetched successfully"));
});

export const updateRecruiterProfile = asyncHandler(async (req, res) => {
  const { avatar, recruiterId, companyName, position, contactNumber, about } =
    req.body;

  // Update avatar
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

  // Find recruiter ID
  const finalRecruiterId = recruiterId || req.user?.recruiterProfile?.id;

  if (!finalRecruiterId) {
    throw new apiErrors(400, "Recruiter profile ID is missing.");
  }
  // Update profile
  const updatedProfile = await prisma.recruiterProfile.update({
    where: { id: finalRecruiterId },
    data: {
      companyName: companyName || undefined,
      position: position || undefined,
      contactNumber: contactNumber || undefined,
      about: about || undefined,
    },
  });

  if (!updatedProfile)
    throw new apiErrors(500, "Recruiter profile updation is failed.");

  // Invalodate profile cache
  await redisClient.del(`profile:${req.user.id}`);

  return res
    .status(200)
    .json(
      new apiSuccess(
        200,
        updatedProfile,
        "Recruiter profile updated successfully"
      )
    );
});

export const recruiterDashboard = asyncHandler(async (req, res) => {
  // Search in cache
  const cache = await redisClient.get(
    `user:${req.user.id}:recruiter:dashboard:${req.user.recruiterProfile.id}`
  );

  // If present then send it
  if (cache) {
    const cachedDashboard = JSON.parse(cache);
    return res
      .status(200)
      .json(
        new apiSuccess(
          200,
          cachedDashboard,
          "Dashboard information is fetched!"
        )
      );
  }

  const jobs = await prisma.job.findMany({
    where: {
      recruiterId: req.user.recruiterProfile.id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      salary: true,
      type: true,
      createdAt: true,
      skillsRequired: true,
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  if (!jobs) throw new apiErrors(500, "Failed to fetch job posts!");

  // Calculate total applications in JS from the same query result
  const totalApplications = jobs.reduce(
    (sum, job) => sum + job._count.applications,
    0
  );

  const averageApplication = Math.ceil(totalApplications / jobs.length);

  // Cache it
  await redisClient.set(
    `user:${req.user.id}:recruiter:dashboard:${req.user.recruiterProfile.id}`,
    JSON.stringify({ jobs, totalApplications, averageApplication }),
    "EX",
    15 * 60
  );

  return res
    .status(200)
    .json(
      new apiSuccess(
        200,
        { jobs, totalApplications, averageApplication },
        "Dashboard information is fetched!"
      )
    );
});
