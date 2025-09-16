import { Router } from "express";
import verifyUser from "../middlewares/auth.middleware.js";
import {
  resumeUploadUrl,
  updateCandidateProfile,
} from "../controllers/candidate.controller.js";
import candidateRole from "../middlewares/candidateRole.middleware.js";

const candidateRoute = Router();

candidateRoute.use(verifyUser);

candidateRoute.route("/resume-uplode-url").post(candidateRole, resumeUploadUrl);
candidateRoute.route("/update-profile").put(updateCandidateProfile); // Invadidate cache (profile line no. 32) D

export default candidateRoute;
