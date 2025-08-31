import { Router } from "express";
import verifyUser from "../middlewares/auth.middleware.js";
import candidateRole from "../middlewares/candidateRole.middleware.js";
import {
  createApplication,
  getApplicationsByJobId,
  getCandidateApplications,
  getInterviewedApplicationsByRecruiter,
  updateApplicationStatus,
} from "../controllers/application.controller.js";
import recruiterRole from "../middlewares/recruiterRole.middleware.js";

const applicationRoutes = Router();

applicationRoutes.use(verifyUser);

applicationRoutes
  .route("/create-application")
  .post(candidateRole, createApplication); // Invalidate cache (getJobById, getApplicationsByJobId, applied-jobs, recruiter dashboard) d
applicationRoutes
  .route("/get-application/:jobId")
  .get(recruiterRole, getApplicationsByJobId); // Cache d
applicationRoutes
  .route("/shortlisted-applications")
  .get(recruiterRole, getInterviewedApplicationsByRecruiter); // Cache d

applicationRoutes
  .route("/status")
  .patch(recruiterRole, updateApplicationStatus); // Invalidate cache (shortlisted-applications) d  
applicationRoutes
  .route("/applied-jobs")
  .get(candidateRole, getCandidateApplications); // Cache d

export default applicationRoutes;
