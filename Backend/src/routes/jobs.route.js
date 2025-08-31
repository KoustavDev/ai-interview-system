import { Router } from "express";
import verifyUser from "../middlewares/auth.middleware.js";
import recruiterRole from "../middlewares/recruiterRole.middleware.js";
import { createJob, getAllJobs, getJobById } from "../controllers/jobs.controller.js";

const jobRoute = Router();

jobRoute.use(verifyUser);

jobRoute.route("/create-job").post(recruiterRole, createJob); // Invalidate cache (recruiter dashboard) d
jobRoute.route("/get-jobs").get(getAllJobs);
jobRoute.route("/get-job/:jobId").get(getJobById); // Cache d

export default jobRoute;
