import { z } from "zod";

// Job posting validation schema
export const jobPostingSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Job title must be at least 2 characters long." })
    .max(100, { message: "Job title must be less than 100 characters." })
    .trim(),
  description: z
    .string()
    .min(50, {
      message: "Job description must be at least 50 characters long.",
    })
    .max(5000, {
      message: "Job description must be less than 5000 characters.",
    })
    .trim(),
  skills: z // skillsRequired
    .array(z.string().min(1).max(50))
    .min(1, { message: "Please add at least one skill." })
    .max(20, { message: "You can add up to 20 skills." }),
  experience: z.string().min(1, { message: "Please select experience level." }),
  location: z
    .string()
    .min(2, { message: "Location must be at least 2 characters long." })
    .max(100, { message: "Location must be less than 100 characters." })
    .trim()
    .optional()
    .or(z.literal("")),
  salary: z
    .string()
    .max(100, { message: "Salary range must be less than 100 characters." })
    .trim()
    .optional()
    .or(z.literal("")),
  jobType: z.string().min(1, { message: "Please select job type." }), // type
  deadline: z.date().optional().nullable(),
  responsibilities: z // responsibility
    .array(z.string().min(1).max(200))
    .min(1, { message: "Please add at least one responsibility." })
    .max(15, { message: "You can add up to 15 responsibilities." }),
  benefits: z
    .array(z.string().min(1).max(200))
    .min(1, { message: "Please add at least one benefit." })
    .max(15, { message: "You can add up to 15 benefits." }),
  requirements: z
    .array(z.string().min(1).max(200))
    .min(1, { message: "Please add at least one requirement." })
    .max(15, { message: "You can add up to 15 requirements." }),
});

export const getJobsQuerySchema = z.object({
  page: z
    .string()
    .default("1")
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Page must be a positive integer greater than 0",
    }),

  limit: z
    .string()
    .default("10")
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Limit must be a positive integer greater than 0",
    }),

  query: z.string().optional(),

  sortBy: z
    .enum(["createdAt", "updatedAt", "title"], {
      // you can extend with allowed DB fields
      invalid_type_error: "Invalid sort field",
    })
    .default("createdAt"),

  sortType: z.enum(["asc", "desc"]).default("desc"),

  recruiterName: z.string().optional(),
});