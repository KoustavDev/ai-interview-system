import { Router } from "express";
import verifyUser from "../middlewares/auth.middleware.js";
import { recruiterDashboard, updateRecruiterProfile } from "../controllers/recruiter.controller.js";
import recruiterRole from "../middlewares/recruiterRole.middleware.js";

const recruiterRoute = Router();

recruiterRoute.use(verifyUser);

recruiterRoute.route("/update-profile").put(updateRecruiterProfile); // Invadidate cache (profile line no. 32) d
recruiterRoute.route("/dashboard").get(recruiterRole, recruiterDashboard); // Cache d

export default recruiterRoute;