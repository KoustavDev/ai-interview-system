import asyncHandler from "../utils/asyncHandler.js";
import apiErrors from "../utils/apiErrors.js";
import apiSuccess from "../utils/apiSuccess.js";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  saveRefreshToken,
  validatePassword,
  sanitizeUser,
} from "../services/userService.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { redisClient, s3Client } from "../index.js";
import crypto from "crypto";
import {
  setResetWindow,
  storeToken,
  validateResetWindow,
  validateToken,
} from "../utils/redisAction.js";
import { sendVerificationEmail } from "../utils/email.js";
import {
  emailSchema,
  fileUploadSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "../validator/user.validator.js";
import formatZodError from "../utils/zodErrorFormater.js";

const generateAccessAndRefreshToken = async (user) => {
  try {
    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save into DB
    const userWithToken = await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: refreshToken },
      include:
        user.role === "recruiter"
          ? {
              recruiterProfile: true,
            }
          : {
              candidateProfile: {
                include: {
                  resumes: true,
                },
              },
            },
    });

    return { accessToken, refreshToken, userWithToken };
  } catch (error) {
    throw new apiErrors(500, "Failed to generate referesh and access token !");
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  // Validate request body
  const result = signupSchema.safeParse(req.body);

  if (!result.success) throw new apiErrors(400, formatZodError(result.error));

  // If valid, destructure safe data
  const { name, email, password, role, companyName } = result.data;

  // Caheck the user is existing or not
  const userExist = await prisma.user.findUnique({ where: { email: email } });
  if (userExist)
    throw new apiErrors(409, "User with email or username already exists");

  // Hashed the password
  const hashedPassword = await hashPassword(password);

  // Use transaction to ensure atomic creation of user + profile
  const finalUser = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role,
      },
    });

    if (role === "recruiter") {
      await tx.recruiterProfile.create({
        data: {
          companyName,
          userId: newUser.id,
        },
      });

      return tx.user.findUnique({
        where: { id: newUser.id },
        include: { recruiterProfile: true },
      });
    } else {
      await tx.candidateProfile.create({
        data: {
          userId: newUser.id,
        },
      });

      return tx.user.findUnique({
        where: { id: newUser.id },
        include: { candidateProfile: true },
      });
    }
  });

  if (!finalUser) {
    throw new apiErrors(500, "Failed to register user");
  }

  // Remove sensitive fields
  const { passwordHash, refreshToken, ...safeUser } = finalUser;

  return res
    .status(201)
    .json(new apiSuccess(201, safeUser, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  // Validate request body
  const result = loginSchema.safeParse(req.body);

  if (!result.success) throw new apiErrors(400, formatZodError(result.error));

  // Get the credentials
  const { email, password } = result.data;

  // find user in DB bases on email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new apiErrors(404, "User does not exist");

  // Check password
  const checkPassword = await validatePassword(password, user.passwordHash);
  if (!checkPassword) throw new apiErrors(401, "Invalid user password");

  // generate access and refresh token
  const { accessToken, refreshToken, userWithToken } =
    await generateAccessAndRefreshToken(user);

  const finalUser = sanitizeUser(userWithToken);

  // send cookies to frontend
  const accessCookieConfig = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 30 * 60 * 1000,
  };
  const refreshCookieConfig = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, accessCookieConfig)
    .cookie("refreshToken", refreshToken, refreshCookieConfig)
    .json(
      new apiSuccess(
        200,
        { finalUser, accessToken, refreshToken },
        "User logged In Successfully"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  // extract user ud
  const userId = req.user.id;

  // Update refresh token in DB
  const user = await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: "" },
  });

  if (!user) throw new apiErrors(500, "Failed to logout user");

  // Send result to frontend
  const cookieConfig = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };
  return res
    .status(200)
    .clearCookie("accessToken", cookieConfig)
    .clearCookie("refreshToken", cookieConfig)
    .json(new apiSuccess(200, {}, "User logged Out"));
});

export const renewTokens = asyncHandler(async (req, res) => {
  // collect refresh token from user
  const userToken = req.cookies?.refreshToken || req.query?.refreshToken;

  // Verification
  if (!userToken) throw new apiErrors(401, "unauthorized request");

  // Decodeing
  const verifyedToken = jwt.verify(userToken, process.env.REFRESH_TOKEN_SECRET);
  if (!verifyedToken) throw new apiErrors(401, "Invalid refresh token");

  // Find the user associated with the token.
  const user = await prisma.user.findUnique({
    where: { id: verifyedToken.id },
  });

  if (!user) throw new apiErrors(401, "Invalid Access Token");

  // generate access and refresh token
  const { accessToken, refreshToken, userWithToken } =
    await generateAccessAndRefreshToken(user);

  const finalUser = sanitizeUser(userWithToken);

  // send cookies to frontend
  const accessCookieConfig = {
    httpOnly: true,
    secure: true,
    maxAge: 30 * 60 * 1000,
  };
  const refreshCookieConfig = {
    httpOnly: true,
    secure: true,
    maxAge: 10 * 24 * 60 * 60 * 1000,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, accessCookieConfig)
    .cookie("refreshToken", refreshToken, refreshCookieConfig)
    .json(
      new apiSuccess(
        200,
        { finalUser, accessToken, refreshToken },
        "User token renew successfull"
      )
    );
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new apiSuccess(200, req.user, "User fetched successfully"));
});

export const changeCurrentPassword = asyncHandler(async (req, res) => {
  // Get the current password and new password from user. //
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    throw new apiErrors(400, "Both password is required!");

  // get the user from db
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) throw new apiErrors(500, "DB failour");

  // Check password
  const checkPassword = await validatePassword(
    currentPassword,
    user.passwordHash
  );
  if (!checkPassword) throw new apiErrors(401, "Invalid user password");

  // Hashed the password
  const hashedPassword = await hashPassword(newPassword);

  // Update password in DB
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: hashedPassword },
  });
  if (!updatedUser) throw new apiErrors(500, "Failed to change password");

  // Send response
  return res
    .status(200)
    .json(new apiSuccess(200, {}, "Password changed successfully!"));
});

export const imageUploadUrl = asyncHandler(async (req, res) => {
  const result = fileUploadSchema.safeParse(req.body);

  if (!result.success) {
    return next(new apiErrors(400, formatZodError(result.error)));
  }

  const { fileName, fileType } = result.data;

  // Get Upload URL
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${req.user.id}/avatar/${fileName}`,
    ContentType: fileType,
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn: 600 }); // Valid for 10 min

  return res
    .status(200)
    .json(
      new apiSuccess(
        200,
        { uploadUrl: url },
        "Upload URL generated successfully!"
      )
    );
});

export const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) throw new apiErrors(400, "User id is needed !");

  // Search is cache
  const cache = await redisClient.get(`profile:${userId}`);

  // If present then send it
  if (cache) {
    const cachedUser = JSON.parse(cache);
    return res
      .status(200)
      .json(
        new apiSuccess(200, cachedUser, "User profile is fetched successfully!")
      );
  }

  // DB call
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      recruiterProfile: true,
      candidateProfile: {
        include: {
          resumes: true,
        },
      },
    },
  });

  if (!user) throw new apiErrors(404, "User not found!");

  // Sanatize it
  const finaluser = sanitizeUser(user);

  // Store it in cache
  await redisClient.set(
    `profile:${userId}`,
    JSON.stringify(finaluser),
    "EX",
    15 * 60
  );

  return res
    .status(200)
    .json(
      new apiSuccess(200, finaluser, "User profile is fetched successfully!")
    );
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = emailSchema.safeParse(req.body);

  if (!result.success) {
    throw new apiErrors(400, result.error.issues[0].message);
  }

  const { email } = result.data;

  // Check the user is existing or not
  const userExist = await prisma.user.findUnique({ where: { email: email } });
  if (!userExist) throw new apiErrors(400, "User with email does not exists!");

  // Generate token
  const token = crypto.randomBytes(32).toString("hex"); // 64 chars, 256 bits

  // Store token in redis
  await storeToken(token, userExist.id);

  // Send email
  await sendVerificationEmail(email, token);

  return res.status(200).json(new apiSuccess(200, { token }, "Token send!"));
});

export const validateGeneratedToken = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) throw new apiErrors(400, "Token is missing!");

  // validate token
  const userId = await validateToken(token);
  if (!userId) throw new apiErrors(400, "Invalid or expired token!");

  // Set a reset window
  await setResetWindow(userId);

  return res
    .status(200)
    .json(new apiSuccess(200, { userId }, "Token is valid!"));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const result = resetPasswordSchema.safeParse(req.body);

  if (!result.success) {
    throw new apiErrors(400, result.error.issues[0].message);
  }

  const { password, id } = result.data;

  const isValid = await validateResetWindow(id);
  if (!isValid) throw new apiErrors(400, "Link expired!");

  // Check the user is existing or not
  const user = await prisma.user.findUnique({ where: { id: id } });
  if (!user) throw new apiErrors(400, "User not found!");

  // Hashed the password
  const hashedPassword = await hashPassword(password);

  // Update password in DB
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: hashedPassword },
  });
  if (!updatedUser) throw new apiErrors(500, "Failed to change password");

  // cleanup reset window
  await redisClient.del(`reset-window:${id}`);

  // Send response
  return res
    .status(200)
    .json(new apiSuccess(200, {}, "Password changed successfully!"));
});
