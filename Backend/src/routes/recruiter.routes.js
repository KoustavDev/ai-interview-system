import { Router } from "express";
import verifyUser from "../middlewares/auth.middleware.js";
import { getRecruiterProfile, recruiterDashboard, updateRecruiterProfile } from "../controllers/recruiter.controller.js";
import recruiterRole from "../middlewares/recruiterRole.middleware.js";

const recruiterRoute = Router();

recruiterRoute.use(verifyUser);

recruiterRoute.route("/update-profile").put(updateRecruiterProfile);
recruiterRoute.route("/dashboard").get(recruiterRole, recruiterDashboard);
recruiterRoute.route("/:userId").get(getRecruiterProfile);

export default recruiterRoute;