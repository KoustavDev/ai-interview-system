import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  renewTokens,
  imageUploadUrl,
  getUserById,
  forgotPassword,
  validateGeneratedToken,
  resetPassword,
} from "../controllers/user.controller.js";
import verifyUser from "../middlewares/auth.middleware.js";

const userRoute = Router();

userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);
userRoute.route("/renew-tokens").get(renewTokens);
userRoute.route("/forgot-password").post(forgotPassword);
userRoute.route("/validate-token").get(validateGeneratedToken);
userRoute.route("/reset-password").post(resetPassword);

// Secured routes
// This routes are protected by my middleware shield.

userRoute.route("/logout").post(verifyUser, logoutUser);
userRoute.route("/change-password").post(verifyUser, changeCurrentPassword);
userRoute.route("/current-user").get(verifyUser, getCurrentUser);
userRoute.route("/profile/:userId").get(verifyUser, getUserById); // Cache d
userRoute.route("/image-uplode-url").post(verifyUser, imageUploadUrl);
export default userRoute;
