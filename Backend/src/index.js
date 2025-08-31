import cors from "cors";
import Redis from "ioredis";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import { S3Client } from "@aws-sdk/client-s3";


dotenv.config({ path: "./.env" });

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));

// Redis Client Connection
export const redisClient = new Redis(process.env.REDIS_SERVICE_URL);

redisClient.on("connect", () => console.log("Connected to Redis"));
redisClient.on("reconnecting", () => console.log("Reconnecting to Redis..."));
redisClient.on("close", () => console.log("Redis connection closed"));
redisClient.on("error", (err) => console.error("Redis Error:", err));

export const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running on port ${process.env.PORT || 8000}`);
});


// Import routers
import userRoute from "./routes/user.routes.js";
import healthCheckRoute from "./routes/healthCheck.routes.js";
import recruiterRoute from "./routes/recruiter.routes.js";
import candidateRoute from "./routes/candidate.routes.js";
import jobRoute from "./routes/jobs.route.js";
import applicationRoutes from "./routes/application.routes.js";
import interviewRouter from "./routes/interview.routes.js";

app.use("/api/v1/healthCheck", healthCheckRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/recruiter",recruiterRoute);
app.use("/api/v1/candidate", candidateRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/applications",applicationRoutes );
app.use("/api/v1/interview",interviewRouter );

/**
profile : profile:${userId}
recruiter dashboard : user:${req.user.id}:recruiter:dashboard:${req.user.recruiterProfile.id}
recruiter shortlisted : user:${req.user.id}:recruiter:shortlisted:${req.user.recruiterProfile.id}
job : user:${req.user.id}:job:${jobId}
getApplicationsByJobId : user:${req.user.id}:job:applications:${jobId}
candidate applied-jobs : `user:${req.user.id}:candidate:applied-jobs:${candidateId}`
report : user:${req.user.id}:report:${applicationId}
 */