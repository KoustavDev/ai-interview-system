import { z } from "zod";

export const updateApplicationStatusSchema = z.object({
  applicationId: z.string({
    required_error: "Application ID is required",
  }),

  status: z.enum(["pending", "shortlisted", "rejected", "interviewed"], {
    required_error: "Status is required",
    invalid_type_error:
      "Invalid status. Must be one of: pending, shortlisted, rejected, interviewed",
  }),
});
