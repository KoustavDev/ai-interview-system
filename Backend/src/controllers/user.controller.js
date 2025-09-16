import asyncHandler from "../utils/helpers/asyncHandler.js";
import apiErrors from "../utils/errors/apiErrors.js";
import apiSuccess from "../utils/errors/apiSuccess.js";
import { UserService } from "../services/user.service.js";
import {
  emailSchema,
  fileUploadSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "../validator/user.validator.js";
import formatZodError from "../utils/formatters/zodErrorFormater.js";

export const registerUser = asyncHandler(async (req, res) => {
  // Validate request body
  const result = signupSchema.safeParse(req.body);

  if (!result.success) throw new apiErrors(400, formatZodError(result.error));

  // If valid, destructure safe data
  const { name, email, password, role, companyName } = result.data;

  // Call user service
  const safeUser = await UserService.registerUser({
    name,
    email,
    password,
    role,
    companyName,
  });

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

  // Call service
  const { accessToken, refreshToken, finalUser } = await UserService.loginUser({
    email,
    password,
  });

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

  // Call service
  await UserService.logoutUser(userId);

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

  /// Call service
  const { accessToken, refreshToken, finalUser } =
    await UserService.renewTokens(userToken);

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
export const imageUploadUrl = asyncHandler(async (req, res) => {
  // Validate body
  const result = fileUploadSchema.safeParse(req.body);
  if (!result.success) {
    return next(new apiErrors(400, formatZodError(result.error)));
  }

  const { fileName, fileType } = result.data;

  // Delegate to service
  const url = await UserService.generateUploadUrl(
    req.user.id,
    fileName,
    fileType
  );

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

  const user = await UserService.getUserById(userId);

  return res
    .status(200)
    .json(new apiSuccess(200, user, "User profile is fetched successfully!"));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = emailSchema.safeParse(req.body);

  if (!result.success) {
    throw new apiErrors(400, result.error.issues[0].message);
  }

  const { email } = result.data;

  const token = await UserService.forgotPassword(email);

  return res.status(200).json(new apiSuccess(200, { token }, "Token send!"));
});

export const validateGeneratedToken = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) throw new apiErrors(400, "Token is missing!");

  const userId = await UserService.validateGeneratedToken(token);

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

  UserService.resetPassword(id, password);

  // Send response
  return res
    .status(200)
    .json(new apiSuccess(200, {}, "Password changed successfully!"));
});
