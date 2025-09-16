import prisma from "../config/prisma.js";

export class CadidateRepository {
  // Create resume record
  static async createResume(candidateId, publicResumeUrl) {
    return await prisma.resume.create({
      data: {
        candidateId,
        fileUrl: publicResumeUrl,
      },
    });
  }

  // Update resume record
  static async updateResume(candidateId, publicResumeUrl) {
    return await prisma.resume.update({
      where: { candidateId },
      data: { fileUrl: publicResumeUrl },
    });
  }

  // Check existing resume record
  static async existingResume(candidateId) {
    return await prisma.resume.findUnique({
      where: { candidateId },
    });
  }

  // Update candidate profile
  static async updateProfile(
    candidateId,
    education,
    experience,
    skills,
    about
  ) {
    await prisma.candidateProfile.update({
      where: { id: candidateId },
      data: {
        education: education || undefined,
        experience: experience || undefined,
        about: about || undefined,
        skills: Array.isArray(skills) ? skills : undefined,
      },
    });
  }
}
