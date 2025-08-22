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
  .post(candidateRole, createApplication);
applicationRoutes
  .route("/get-application/:jobId")
  .get(recruiterRole, getApplicationsByJobId);
applicationRoutes
  .route("/shortlisted-applications")
  .get(recruiterRole, getInterviewedApplicationsByRecruiter);

applicationRoutes
  .route("/status")
  .patch(recruiterRole, updateApplicationStatus);
applicationRoutes
  .route("/applied-jobs")
  .get(candidateRole, getCandidateApplications);

export default applicationRoutes;
