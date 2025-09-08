import { z } from "zod";

// Signup schema
export const signupSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),

  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  role: z.enum(["recruiter", "candidate"], {
    required_error: "Role is required",
  }),

  companyName: z.string().optional(),
});

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, "Password must be at least 8 characters"),
});

export const fileUploadSchema = z.object({
  fileName: z.string({
    required_error: "File name is required",
  }),

  fileType: z.enum(["image/jpeg", "image/png", "image/webp"], {
    required_error: "File type is required",
    invalid_type_error: "Unsupported file type!",
  }),
});

export const resumeUploadSchema = z.object({
  fileName: z.string({
    required_error: "File name is required",
  }),

  fileType: z.enum(
    [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    {
      required_error: "File type is required",
      invalid_type_error: "Unsupported file type!",
    }
  ),
});

export const userIdParamSchema = z.object({
  userId: z.string({
    required_error: "User id is required",
  }),
});

export const emailSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Please enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  id: z
    .string({
      required_error: "ID is required",
    })
    .min(1, "ID is required"),

  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});