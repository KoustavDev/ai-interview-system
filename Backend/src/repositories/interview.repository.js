import prisma from "../config/prisma.js";

export class InterviewRepository {
  // Get interview by id
  static async getInterviewById(id) {
    return await prisma.aIInterview.findUnique({
      where: { id },
    });
  }

  // Get interview by application id
  static async getInterviewByApplicationId(applicationId) {
    return await prisma.aIInterview.findUnique({
      where: { applicationId },
    });
  }

  // Get a report by application id
  static async getReportByApplicationId(applicationId) {
    return await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        candidate: {
          select: {
            experience: true,
            skills: true,
            user: {
              select: {
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        job: { select: { title: true, recruiterId: true } },
        interview: {
          include: {
            chatMessages: {
              orderBy: { timestamp: "asc" },
            },
            report: true,
          },
        },
      },
    });
  }

  // Create interview
  static async createInterview(applicationId) {
    return await prisma.aIInterview.create({
      data: {
        applicationId,
      },
    });
  }
  // Detele an interview
  static async deleteInterview(id) {
    return await prisma.aIInterview.delete({
      where: { id },
    });
  }

  // Find interview chats
  static async getInterviewChats(interviewId) {
    return await prisma.aIInterview.findUnique({
      where: { id: interviewId },
      include: {
        chatMessages: {
          orderBy: { timestamp: "asc" },
        },
      },
    });
  }

  // Generate report and mark interview as completed
  static async createReport(result, interviewId) {
    return await prisma.aIInterview.update({
      where: { id: interviewId }, // Find the interview
      data: {
        report: {
          create: {
            // Create a related "report" record
            score: result.score,
            summary: result.summary,
          },
        },
        completedAt: new Date(), // Also mark interview as completed
      },
      include: {
        report: true,
      },
    });
  }

  // Get full interview details along with job, recruiter and candidate details
  static async getFullInterview(interviewId) {
    return await prisma.aIInterview.findUnique({
      where: { id: interviewId },
      include: {
        application: {
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
        },
      },
    });
  }

  // Get create messages
  static async storeMessage(interviewId, sender, message) {
    return await prisma.aIChatMessage.create({
      data: {
        interviewId,
        sender,
        message,
      },
    });
  }

  // Fetch full chat history (sorted)
  static async getChatHistory(interviewId) {
    return await prisma.aIChatMessage.findMany({
      where: { interviewId },
      orderBy: { timestamp: "asc" },
      select: { sender: true, message: true },
    });
  }

  // Save AI response to DB
  static async saveAiResponse(interviewId, message) {
    return await prisma.aIChatMessage.create({
      data: {
        interviewId,
        sender: "ai",
        message,
      },
    });
  }
}
