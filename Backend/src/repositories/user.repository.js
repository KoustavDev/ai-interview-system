import prisma from "../config/prisma.js";

export class UserRepository {
  // Find a user by email
  static async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  // Find user by ID
  static async findById(userId) {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  }

  // Create user + profile in an atomic transaction
  static async createUserWithProfile({
    name,
    email,
    passwordHash,
    role,
    companyName,
  }) {
    return prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { name, email, passwordHash, role },
      });

      if (role === "recruiter") {
        await tx.recruiterProfile.create({
          data: { companyName, userId: newUser.id },
        });

        return tx.user.findUnique({
          where: { id: newUser.id },
          include: { recruiterProfile: true },
        });
      } else {
        await tx.candidateProfile.create({
          data: { userId: newUser.id },
        });

        return tx.user.findUnique({
          where: { id: newUser.id },
          include: { candidateProfile: true },
        });
      }
    });
  }

  // Save refresh token
  static async saveRefreshToken(userId, token) {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken: token },
    });
  }

  // Save refresh token and return user with profile
  static async saveRefreshTokenAndReturnUser(user, refreshToken) {
    return prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
      include:
        user.role === "recruiter"
          ? { recruiterProfile: true }
          : {
              candidateProfile: {
                include: { resumes: true },
              },
            },
    });
  }

  // Clear refresh token
  static async clearRefreshToken(userId) {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken: "" },
    });
  }

  static async profileById(userId) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        recruiterProfile: true,
        candidateProfile: {
          include: { resumes: true },
        },
      },
    });
  }

  // Update password in DB
  static async updatedUserPassword(id, hashedPassword) {
    await prisma.user.update({
      where: { id },
      data: { passwordHash: hashedPassword },
    });
  }

  // Update avatar
  static async updateAvatar(id, publicAvatarUrl) {
    return await prisma.user.update({
      where: { id },
      data: {
        avatar: publicAvatarUrl || undefined,
      },
    });
  }
}
