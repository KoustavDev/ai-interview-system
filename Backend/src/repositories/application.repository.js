import prisma from "../config/prisma.js";

export class ApplicationRepository {
  // Get application by id
  static async getApplicationById(id) {
    return await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          select: { recruiterId: true },
        },
      },
    });
  }

  // // Get full application details along with job, recruiter and candidate details
  static async getFullApplication(applicationId){
    return await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          include: {
            recruiter: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  // Check a candidate already applied to a job or not
  static async checkAppliedApplication(jobId, candidateId) {
    return await prisma.application.findFirst({
      where: {
        jobId,
        candidateId,
      },
    });
  }

  // Create application
  static async createApplication(jobId, candidateId, resumeId) {
    return await prisma.application.create({
      data: {
        jobId,
        candidateId,
        resumeId,
      },
      include: {
        job: true,
        resume: true,
      },
    });
  }

  // Get application
  static async getApplicationByJobId(jobId) {
    return await prisma.application.findMany({
      where: { jobId },
      include: {
        job: {
          select: {
            title: true,
          },
        },
        candidate: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        resume: {
          select: { fileUrl: true },
        },
        interview: {
          include: {
            report: {
              select: { score: true },
            },
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
    });
  }

  //  Get all job IDs created by this recruiter
  static async recruitersJobPosts(recruiterId) {
    return await prisma.job.findMany({
      where: {
        recruiterId,
      },
      select: {
        id: true,
      },
    });
  }

  //  Get all applications with status = interviewed
  static async getInterviewedApplications(jobIds) {
    return await prisma.application.findMany({
      where: {
        jobId: { in: jobIds },
        status: { in: ["shortlisted", "rejected", "interviewed"] },
      },
      include: {
        candidate: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        job: {
          select: {
            title: true,
          },
        },
        interview: {
          include: {
            report: {
              select: { score: true },
            },
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
    });
  }

  // Update the status
  static async updateApplicationStatus(applicationId, status) {
    return await prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });
  }

  static async getAllCandidateApplications(candidateId) {
    return await prisma.application.findMany({
      where: { candidateId },
      include: {
        job: {
          include: {
            recruiter: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
    });
  }
}
