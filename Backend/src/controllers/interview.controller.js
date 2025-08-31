import asyncHandler from "../utils/asyncHandler.js";
import apiErrors from "../utils/apiErrors.js";
import apiSuccess from "../utils/apiSuccess.js";
import prisma from "../lib/prisma.js";
import openAiClient from "../lib/openAI.js";
import { buildReportPrompt, buildSystemPrompt } from "../lib/prompt.js";
import { redisClient } from "../index.js";

export const startInterview = asyncHandler(async (req, res) => {
  // Collect payloads
  const { applicationId } = req.body;
  const candidateId = req.user?.candidateProfile?.id;

  if (!applicationId || !candidateId)
    throw new apiErrors(400, "All fields are required !");

  // Fetch application by ID along with jobs, recruiter info and their user profile
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        include: {
          recruiter: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!application) throw new apiErrors(400, "Application not found !");

  if (application.status !== "pending")
    throw new apiErrors(409, "You have already been interviewed for this job.");

  // Check an interview exist or not
  const interviewExist = await prisma.aIInterview.findUnique({
    where: { applicationId },
  });

  // If exist then delete it
  if (interviewExist) {
    await prisma.aIInterview.delete({
      where: { id: interviewExist.id },
    });
  }

  // Create AIinterview
  const interview = await prisma.aIInterview.create({
    data: {
      applicationId,
    },
  });

  if (!interview) throw new apiErrors(500, "Failed to start interview !");

  // Get system prompt message
  const systemMessage = buildSystemPrompt(application.job);

  // Get AI response
  const aiResponse = await openAiClient.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
    ],
  });

  if (!aiResponse) throw new apiErrors(500, "Failed to get AT response !");

  let aiMessage = aiResponse.choices[0].message.content;

  // Remove Markdown code block formatting if present
  if (aiMessage.startsWith("```")) {
    aiMessage = aiMessage
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }

  let result;
  try {
    result = JSON.parse(aiMessage);
  } catch (err) {
    console.error("Invalid AI JSON:", aiMessage);
    throw new apiErrors(500, "AI returned invalid JSON format");
  }

  // Store message in DB
  const messageRecord = await prisma.aIChatMessage.create({
    data: {
      interviewId: interview.id,
      sender: "ai",
      message: result.message,
    },
  });

  if (!messageRecord) throw new apiErrors(500, "Failed to save message !");
  const jobTitle = application.job.title;

  return res
    .status(201)
    .json(
      new apiSuccess(
        201,
        { messageRecord, interview, jobTitle, isFinished: false },
        "Candidate applications fetched successfully"
      )
    );
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { interviewId, message } = req.body;

  if (!interviewId || !message)
    throw new apiErrors(400, "Missing interviewId or message");

  const interview = await prisma.aIInterview.findUnique({
    where: { id: interviewId },
    include: {
      application: {
        include: {
          job: {
            include: {
              recruiter: {
                include: {
                  user: {
                    select: {
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!interview) throw new apiErrors(404, "Interview not found!");

  // Rebuild conversation history
  const systemPrompt = buildSystemPrompt(interview.application.job);

  // Save message
  const candidateMessage = await prisma.aIChatMessage.create({
    data: {
      interviewId: interviewId,
      sender: "candidate",
      message: message,
    },
  });

  if (!candidateMessage)
    throw new apiErrors(500, "Failed to save candidate message !");

  // Fetch full chat history (sorted)
  const history = await prisma.aIChatMessage.findMany({
    where: { interviewId },
    orderBy: { timestamp: "asc" },
    select: { sender: true, message: true },
  });

  if (!history) throw new apiErrors(500, "Failed to fetch chat history !");

  // Transform history into OpenAI format
  const openAiMessages = history.map((msg) => ({
    role: msg.sender === "ai" ? "assistant" : "user",
    content: msg.message,
  }));

  openAiMessages.unshift({ role: "system", content: systemPrompt });
  openAiMessages.push({
    role: "user",
    content:
      'IMPORTANT: Respond strictly in JSON only, no extra text or formatting:\n{"message": <string>, "isFinished": <boolean>}',
  });

  // Get AI response
  const chatCompletion = await openAiClient.chat.completions.create({
    model: "gpt-4o",
    messages: openAiMessages,
  });

  if (!chatCompletion) throw new apiErrors(500, "Failed to get AT response !");

  let aiResponse =
    chatCompletion.choices[0].message.content ||
    '{"message": "I\'m sorry, I couldn\'t understand that.", "isFinished": "false"}';

  let cleaned = aiResponse.trim();

  // Remove triple backticks and optional "json"
  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();
  }

  let result;
  try {
    result = JSON.parse(cleaned);
  } catch (err) {
    console.error("AI response could not be parsed:", cleaned);
    throw new apiErrors(500, "Failed to parse AI report response");
  }

  // if (aiResponse.includes("[INTERVIEW_COMPLETE]")) {
  //   result.isFinished = true;
  //   aiResponse = aiResponse.replace("[INTERVIEW_COMPLETE]", "").trim();
  // }

  // Save AI response to DB
  const messageRecord = await prisma.aIChatMessage.create({
    data: {
      interviewId: interviewId,
      sender: "ai",
      message: result.message,
    },
  });

  if (!messageRecord) throw new apiErrors(500, "Failed to save AI message !");

  return res
    .status(200)
    .json(
      new apiSuccess(
        200,
        { messageRecord, isFinished: result.isFinished },
        "Response generated successfully"
      )
    );
});

export const generateInterviewReport = asyncHandler(async (req, res) => {
  const { interviewId } = req.body;

  if (!interviewId) throw new apiErrors(400, "Interview ID is not provided !");

  const interview = await prisma.aIInterview.findUnique({
    where: { id: interviewId },
    include: {
      chatMessages: {
        orderBy: { timestamp: "asc" },
      },
    },
  });

  if (!interview) throw new apiErrors(404, "Interview not found");

  // Update application status
  const updateApplicationStatus = await prisma.application.update({
    where: { id: interview.applicationId },
    data: { status: "interviewed" },
  });

  if (!updateApplicationStatus)
    throw new apiErrors(500, "Failed to update application status !");

  if (!interview.chatMessages || interview.chatMessages.length === 0) {
    throw new apiErrors(400, "Interview has no chat messages");
  }

  // Format conversation
  const conversation = interview.chatMessages
    .map((msg) => {
      const sender = msg.sender === "ai" ? "AI" : "Candidate";
      return `${sender}: ${msg.message}`;
    })
    .join("\n");

  const prompt = buildReportPrompt(conversation);

  const completion = await openAiClient.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  if (!completion) throw new apiErrors(500, "Failed to get AI response !");

  const raw = completion.choices[0].message.content;

  let cleaned = raw.trim();

  // Remove triple backticks and optional "json"
  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();
  }

  let result;
  try {
    result = JSON.parse(cleaned);
  } catch (err) {
    console.error("AI response could not be parsed:", raw);
    throw new apiErrors(500, "Failed to parse AI report response");
  }

  // Save the report and mark interview as completed
  const report = await prisma.aIInterview.update({
    where: { id: interviewId }, // Find the interview
    data: {
      report: {
        create: {
          // Create a related "report" record
          score: result.score,
          summary: result.summary,
        },
      },
      completedAt: new Date(), // Also mark interview as completed
    },
    include: {
      report: true,
    },
  });

  res.status(201).json(new apiSuccess(201, report, "Report is generated !"));
});

export const deleteInterview = asyncHandler(async (req, res) => {
  const { interviewId } = req.query;

  // Check if interview exists
  const interview = await prisma.aIInterview.findUnique({
    where: { id: interviewId },
  });

  if (!interview) {
    throw new apiErrors(404, "Interview not found");
  }

  // Delete the interview
  await prisma.aIInterview.delete({
    where: { id: interviewId },
  });

  res.status(200).json(new apiSuccess(200, {}, "Interview is deleted !"));
});

export const getReport = asyncHandler(async (req, res) => {
  const { applicationId } = req.query;

  if (!applicationId) throw new apiErrors(400, "Application id is needed !");

  const cache = await redisClient.get(
    `user:${req.user.id}:report:${applicationId}`
  );

  if (cache) {
    const cachedReport = JSON.parse(cache);
    return res
      .status(200)
      .json(
        new apiSuccess(200, cachedReport, "Report is fetched seccessfully !")
      );
  }
  const report = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      candidate: {
        select: {
          experience: true,
          skills: true,
          user: {
            select: {
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      },
      job: { select: { title: true, recruiterId: true } },
      interview: {
        include: {
          chatMessages: {
            orderBy: { timestamp: "asc" },
          },
          report: true,
        },
      },
    },
  });

  if (!report) throw new apiErrors(500, "Failed to fetch report !");

  // TODO
  if (report.job.recruiterId !== req.user.recruiterProfile.id)
    throw new apiErrors(403, "Not access forbidden!");

  // Remove recruiterId from job before sending response
  if (report.job && report.job.recruiterId) {
    delete report.job.recruiterId;
  }

  await redisClient.set(
    `user:${req.user.id}:report:${applicationId}`,
    JSON.stringify(report),
    "EX",
    30 * 60
  );
  return res
    .status(200)
    .json(new apiSuccess(200, report, "Report is fetched seccessfully !"));
});
