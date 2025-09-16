import prisma from "../config/prisma.js";

export class JobRepository {
  static async findRecruiterById(id) {
    return await prisma.recruiterProfile.findUnique({
      where: { id },
      select: { id: true },
    });
  }

  static async getJobById(id) {
    return await prisma.job.findUnique({
      where: { id },
    });
  }

  static async createJob(
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
    return await prisma.job.create({
      data: {
        recruiterId,
        title,
        type,
        salary,
        description,
        skillsRequired,
        experience,
        location,
        deadline: deadline ? new Date(deadline) : undefined,
        responsibility,
        benefits,
        requirement,
      },
    });
  }

  static async findRecruitersByName(recruiterName) {
    return await prisma.user.findMany({
      where: {
        name: {
          contains: recruiterName,
          mode: "insensitive",
        },
      },
      include: {
        recruiterProfile: true,
      },
    });
  }

  static async paginatedJobs(filter, sortBy, sortType, limit, skip) {
    return await Promise.all([
      prisma.job.count({ where: filter }),
      prisma.job.findMany({
        where: filter,
        orderBy: {
          [sortBy]: sortType === "asc" ? "asc" : "desc",
        },
        skip,
        take: limit,
        include: {
          recruiter: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
        },
      }),
    ]);
  }

  static async appliedJobs(candidateId) {
    return await prisma.application.findMany({
      where: { candidateId },
      select: { jobId: true },
    });
  }

  static async fetchFullJobDetails(jobId, candidateId) {
    return await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        recruiter: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        applications: {
          where: {
            candidateId: candidateId || "", // prevent error if candidateId is undefined
          },
          select: {
            id: true,
            status: true,
          },
        },
      },
    });
  }
}
