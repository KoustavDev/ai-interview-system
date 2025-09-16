import jwt from "jsonwebtoken";
import apiErrors from "../utils/errors/apiErrors.js";
import asyncHandler from "../utils/helpers/asyncHandler.js";
import prisma from "../config/prisma.js";
import { UserService } from "../services/user.service.js";

// This middleware verify that the user verifyed to goto some routes or not.
// It a shield to prevent unauthorized user to goto some protected routes.
// Also provide user info from the DB.
const verifyUser = asyncHandler(async (req, res, next) => {
  try {
    // Get the JWT token from cookies or Authorization header.
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token)
      res.status(401).json({ success: false, message: "Unauthorized request" });

    // Verify the JWT token.
    let verifyedToken;

    try {
      verifyedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      res
        .status(401)
        .json({ success: false, message: "Your JWT token is unauthorized" });
    }

    if (!verifyedToken)
      res
        .status(401)
        .json({ success: false, message: "Unauthorized request !" });

    const user = await prisma.user.findUnique({
      where: { id: verifyedToken.id },
      include:
        verifyedToken.role === "recruiter"
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

    if (!user) throw new apiErrors(401, "Invalid Access Token");

    // Remove refreshToken and password field
    const finalUser = UserService.sanitizeUser(user);

    // Add the authenticated user to the request object.
    req.user = finalUser;

    next();
  } catch (error) {
    throw new apiErrors(401, error?.message || "Invalid Access Token");
  }
});

export default verifyUser;
