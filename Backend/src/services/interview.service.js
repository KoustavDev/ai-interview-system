import { ApplicationRepository } from "../repositories/application.repository.js";
import { InterviewRepository } from "../repositories/interview.repository.js";
import { buildReportPrompt, buildSystemPrompt } from "../config/prompt.js";
import apiErrors from "../utils/errors/apiErrors.js";
import { Cache } from "../utils/redis/redisAction.js";
import openAiClient from "../config/openAI.js";

export class InterviewService {
  static async getReport(userId, recruiterId, applicationId) {
    const cache = await Cache.get(`user:${userId}:report:${applicationId}`);

    if (cache) return cache;

    const report =
      await InterviewRepository.getReportByApplicationId(applicationId);

    if (!report) throw new apiErrors(500, "Failed to fetch report !");

    if (report.job.recruiterId !== recruiterId)
      throw new apiErrors(403, "You are not authorized to access this report!");

    // Remove recruiterId from job before sending response
    if (report.job && report.job.recruiterId) {
      delete report.job.recruiterId;
    }

    await Cache.set(`user:${userId}:report:${applicationId}`, report, 30 * 60);

    return report;
  }

  static async deleteInterview(interviewId) {
    // Check if interview exists
    const interview = await InterviewRepository.getInterviewById(interviewId);

    if (!interview) {
      throw new apiErrors(404, "Interview not found");
    }

    // Delete the interview
    await InterviewRepository.deleteInterview(interviewId);
  }

  static async generateReport(interviewId) {
    const interview = await InterviewRepository.getInterviewChats(interviewId);

    if (!interview) throw new apiErrors(404, "Interview not found");

    // Update application status
    const updateApplicationStatus =
      await ApplicationRepository.updateApplicationStatus(
        interview.applicationId,
        "interviewed"
      );

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
    const report = await InterviewRepository.createReport(
      result,
      interviewId
    );

    return report;
  }

  static async sendMessage(interviewId, message) {
    const interview = await InterviewRepository.getFullInterview(interviewId);

    if (!interview) throw new apiErrors(404, "Interview not found!");

    // Rebuild conversation history
    const systemPrompt = buildSystemPrompt(interview.application.job);

    // Save message
    const candidateMessage = await InterviewRepository.storeMessage(
      interviewId,
      message
    );

    if (!candidateMessage)
      throw new apiErrors(500, "Failed to save candidate message !");

    // Fetch full chat history (sorted)
    const history = await InterviewRepository.getChatHistory(interviewId);

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

    if (!chatCompletion)
      throw new apiErrors(500, "Failed to get AT response !");

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
    const messageRecord = await InterviewRepository.saveAiResponse(
      interviewId,
      "candidate",
      result.message
    );

    return { messageRecord, isFinished: result.isFinished };
  }

  static async startInterview(applicationId) {
    // Fetch application by ID along with jobs, recruiter info and their user profile
    const application =
      await ApplicationRepository.getFullApplication(applicationId);

    if (!application) throw new apiErrors(400, "Application not found !");

    if (application.status !== "pending")
      throw new apiErrors(
        409,
        "You have already been interviewed for this job."
      );

    // Check an interview exist or not
    const interviewExist =
      await InterviewRepository.getInterviewByApplicationId(applicationId);

    // If exist then delete it
    if (interviewExist) {
      await InterviewRepository.deleteInterview(interviewExist.id);
    }

    // Create AIinterview
    const interview = await InterviewRepository.createInterview(applicationId);

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
    const messageRecord = await InterviewRepository.storeMessage(
      interview.id,
      "ai",
      result.message
    );

    if (!messageRecord) throw new apiErrors(500, "Failed to save message !");
    const jobTitle = application.job.title;

    return { messageRecord, interview, jobTitle, isFinished: false };
  }
}
