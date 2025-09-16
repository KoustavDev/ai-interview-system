import prisma from "../config/prisma.js";

export class RecruiterRepository {

  // Update profile
  static async updateProfile(
    finalRecruiterId,
    companyName,
    position,
    contactNumber,
    about
  ) {
    return await prisma.recruiterProfile.update({
      where: { id: finalRecruiterId },
      data: {
        companyName: companyName || undefined,
        position: position || undefined,
        contactNumber: contactNumber || undefined,
        about: about || undefined,
      },
    });
  }

  // Posted jobs
  static async recruiterJobs(id) {
    return await prisma.job.findMany({
      where: {
        recruiterId: id,
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
  }
}