import { z } from "zod";

// Zod validation schemas
export const signupSchema = z
  .object({
    role: z.enum(["recruiter", "candidate"], {
      required_error: "Please select a role",
    }),
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .max(100, "Email must be less than 100 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be less than 100 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    company: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === "recruiter") {
        return data.company && data.company.trim().length > 0;
      }
      return true;
    },
    {
      message: "Company name is required for recruiters",
      path: ["company"],
    }
  );

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
})

export const recruiterProfileUpdateSchema = z.object({
  company: z
    .string()
    .min(2, { message: "Company name must be at least 2 characters long." })
    .max(100, { message: "Company name must be less than 100 characters." })
    .trim(),
  position: z
    .string()
    .min(2, { message: "Position must be at least 2 characters long." })
    .max(100, { message: "Position must be less than 100 characters." })
    .trim(),
  about: z
    .string()
    .min(10, { message: "About section must be at least 10 characters long." })
    .max(1000, { message: "About section must be less than 1000 characters." })
    .trim(),
  contactNumber: z
    .string()
    .regex(/^[+]?[1-9][\d]{0,15}$/, {
      message: "Please enter a valid phone number.",
    })
    .min(10, { message: "Phone number must be at least 10 digits." })
    .max(17, { message: "Phone number must be less than 17 characters." })
    .trim(),
});

export const candidateProfileUpdateSchema = z.object({
  education: z
    .string()
    .min(2, { message: "Education must be at least 2 characters long." })
    .max(200, { message: "Education must be less than 200 characters." })
    .trim(),
  experience: z
    .string()
    .min(2, { message: "Experience must be at least 2 characters long." })
    .max(200, { message: "Experience must be less than 200 characters." })
    .trim(),
  about: z
    .string()
    .min(10, { message: "About section must be at least 10 characters long." })
    .max(1000, { message: "About section must be less than 1000 characters." })
    .trim(),
  skills: z
    .array(z.string().min(1).max(50))
    .min(1, { message: "Please add at least one skill." })
    .max(20, { message: "You can add up to 20 skills." }),
});

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