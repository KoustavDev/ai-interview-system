import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import apiErrors from "../utils/errors/apiErrors.js";
import { UserRepository } from "../repositories/user.repository.js";
import { s3Client } from "../index.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Cache } from "../utils/redis/redisAction.js";
import { sendVerificationEmail } from "../utils/email/email.js";

export class UserService {
  // Hash password
  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  // Validate password
  static async validatePassword(passwordFromReq, passwordFromDB) {
    return await bcrypt.compare(passwordFromReq, passwordFromDB);
  }

  // Generate access token
  static generateAccessToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
  }

  // Generate refresh token
  static generateRefreshToken(user) {
    return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
  }

  // Save refresh token
  static async saveRefreshToken(userId, token) {
    return UserRepository.saveRefreshToken(userId, token);
  }

  // Sanitize user object
  static sanitizeUser(user) {
    const { passwordHash, refreshToken, ...safeUser } = user;
    return safeUser;
  }

  // Register new user
  static async registerUser({ name, email, password, role, companyName }) {
    // Check user exist or not
    const userExist = await UserRepository.findByEmail(email);
    if (userExist)
      throw new apiErrors(409, "User with email or username already exists");

    const hashedPassword = await this.hashPassword(password);

    const finalUser = await UserRepository.createUserWithProfile({
      name,
      email,
      passwordHash: hashedPassword,
      role,
      companyName,
    });

    if (!finalUser) throw new apiErrors(500, "Failed to register user");

    return this.sanitizeUser(finalUser);
  }

  // Generate and save tokens
  static async generateAccessAndRefreshToken(user) {
    try {
      // Generate tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      const userWithToken = await UserRepository.saveRefreshTokenAndReturnUser(
        user,
        refreshToken
      );

      return { accessToken, refreshToken, userWithToken };
    } catch (error) {
      throw new apiErrors(500, "Failed to generate refresh and access token!");
    }
  }

  // Login user
  static async loginUser({ email, password }) {
    // find user in DB bases on email
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new apiErrors(404, "User does not exist");

    // Check password
    const checkPassword = await this.validatePassword(
      password,
      user.passwordHash
    );
    if (!checkPassword) throw new apiErrors(401, "Invalid user password");

    // generate access and refresh token
    const { accessToken, refreshToken, userWithToken } =
      await this.generateAccessAndRefreshToken(user);

    // Sanitize user data
    const finalUser = this.sanitizeUser(userWithToken);
    return { accessToken, refreshToken, finalUser };
  }

  // Logout user
  static async logoutUser(userId) {
    const user = await UserRepository.clearRefreshToken(userId);
    if (!user) throw new apiErrors(500, "Failed to logout user");
    return true;
  }

  // Renew tokens
  static async renewTokens(userToken) {
    if (!userToken) throw new apiErrors(401, "Unauthorized request");

    // Verify refresh token
    const verifiedToken = jwt.verify(
      userToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!verifiedToken) throw new apiErrors(401, "Invalid refresh token");

    // Find user
    const user = await UserRepository.findById(verifiedToken.id);
    if (!user) throw new apiErrors(401, "Invalid access token");

    // Generate new tokens
    const { accessToken, refreshToken, userWithToken } =
      await this.generateAccessAndRefreshToken(user);

    const finalUser = this.sanitizeUser(userWithToken);

    return { accessToken, refreshToken, finalUser };
  }

  // Generate S3 signed upload url
  static async generateUploadUrl(userId, fileName, fileType) {
    try {
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${userId}/avatar/${fileName}`,
        ContentType: fileType,
      });

      return await getSignedUrl(s3Client, command, { expiresIn: 600 }); // Valid 10 min
    } catch (error) {
      throw new apiErrors(500, "Failed to generate S3 signed URL");
    }
  }

  static async getUserById(userId) {
    if (!userId) throw new apiErrors(400, "User id is needed!");

    // Check cache
    const cachedUser = await Cache.get(`profile:${userId}`);
    if (cachedUser) return cachedUser;

    // Fetch from DB
    const user = await UserRepository.profileById(userId);
    if (!user) throw new apiErrors(404, "User not found!");

    // Sanitize
    const finalUser = this.sanitizeUser(user);

    // Store in cache
    await Cache.set(`profile:${userId}`, finalUser, 15 * 60);

    return finalUser;
  }

  static async forgotPassword(email) {
    // Check the user is existing or not
    const userExist = await UserRepository.findByEmail(email);
    if (!userExist)
      throw new apiErrors(400, "User with email does not exists!");

    // Generate token
    const token = crypto.randomBytes(32).toString("hex"); // 64 chars, 256 bits

    // Store token in redis
    await Cache.storeToken(token, userExist.id);

    // Send email
    await sendVerificationEmail(email, token);

    return token;
  }

  static async validateGeneratedToken(token) {
    // validate token
    const userId = await Cache.validateToken(token);
    if (!userId) throw new apiErrors(400, "Invalid or expired token!");

    // Set a reset window
    await Cache.setResetWindow(userId);

    return userId;
  }

  static async resetPassword(id, password) {
    const isValid = await Cache.validateResetWindow(id);
    if (!isValid) throw new apiErrors(400, "Link expired!");

    // Check the user is existing or not
    const user = await UserRepository.findById(id);
    if (!user) throw new apiErrors(400, "User not found!");

    // Hash the password
    const hashedPassword = await this.hashPassword(password);

    // Update password in DB
    const updatedUser = await UserRepository.updatedUserPassword(
      id,
      hashedPassword
    );
    if (!updatedUser) throw new apiErrors(500, "Failed to change password");

    // cleanup reset window
    await Cache.del(`reset-window:${id}`);
  }
}
