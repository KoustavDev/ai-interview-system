import { Router } from "express";
import verifyUser from "../middlewares/auth.middleware.js";
import { getCandidateProfile, resumeUploadUrl, updateCandidateProfile } from "../controllers/candidate.controller.js";
import candidateRole from "../middlewares/candidateRole.middleware.js";

const candidateRoute = Router();

candidateRoute.use(verifyUser);

candidateRoute.route("/resume-uplode-url").post(candidateRole,resumeUploadUrl);
candidateRoute.route("/update-profile").put(updateCandidateProfile);
candidateRoute.route("/:userId").get(getCandidateProfile);

export default candidateRoute;
