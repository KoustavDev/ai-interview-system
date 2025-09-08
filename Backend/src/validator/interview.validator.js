import { z } from "zod";

export const sendMessageSchema = z.object({
  interviewId: z.string({
    required_error: "Interview ID is required",
  }),

  message: z
    .string({
      required_error: "Message is required",
    })
    .min(1, "Message cannot be empty")
    .max(1000, "Message must be less than 1000 characters"),
});
