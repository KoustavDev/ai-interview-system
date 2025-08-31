import { Router } from "express";
import verifyUser from "../middlewares/auth.middleware.js";
import candidateRole from "../middlewares/candidateRole.middleware.js";
import { deleteInterview, generateInterviewReport, getReport, sendMessage, startInterview } from "../controllers/interview.controller.js";
import recruiterRole from "../middlewares/recruiterRole.middleware.js";

const interviewRouter = Router();

interviewRouter.use(verifyUser);

interviewRouter.route("/start").post(candidateRole, startInterview);
interviewRouter.route("/chat").post(candidateRole, sendMessage);
interviewRouter.route("/report").post(candidateRole, generateInterviewReport);
interviewRouter.route("/delete").delete(deleteInterview);
interviewRouter.route("/report").get(recruiterRole, getReport); // Cache d


export default interviewRouter;
