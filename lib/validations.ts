import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long. " })
    .max(100, { message: "Password cannot exceed 100 characters." }),
});

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username cannot exceed 30 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),

  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),

  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});

export const UserSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." }),
  email: z.string().email({ message: "Please provide a valid email address." }),
  image: z.string().url({ message: "Please provide a valid URL." }).optional(),
});

export const AccountSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
  name: z.string().min(1, { message: "Name is required." }),
  image: z.string().url({ message: "Please provide a valid URL." }).optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),
  provider: z.string().min(1, { message: "Provider is required." }),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required." }),
  accountType: z.enum(["STANDARD", "PRO"]),
  activePlan: z.string().optional(),
  eventCredits: z.number().optional(),
  planExpiryDate: z.date().optional(),
});

export const signInWithOAuthSchema = z.object({
  provider: z.enum(["google", "github"]),
  providerAccountId: z.string().min(1, {
    message: "Provider Account ID is required.",
  }),
  user: z.object({
    name: z.string().min(1, { message: "Name is required." }),
    email: z
      .string()
      .email({ message: "Please provide a valid email address." }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long." }),
    image: z
      .string()
      .url({ message: "Please provide a valid URL." })
      .optional(),
  }),
});

export const PaginatedSearchParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

export const eventFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  startDate: z.date(),
  location: z.string().optional(),
});

export const createEventSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required." })
    .max(100, { message: "Title cannot exceed 100 characters." }),

  description: z
    .string()
    .min(1, { message: "Description is required." })
    .max(500, { message: "Description cannot exceed 500 characters." }),
  accountId: z.string().min(1, { message: "Account ID is required." }),
  qrCode: z.string().min(1, { message: "QR Code is required." }),
  startDate: z.date(),
  endDate: z.date().optional(),
  expiryDate: z.date(),
  maxUploadsPerAttendee: z
    .number()
    .min(1, { message: "Max uploads per attendee must be at least 1." }),
  location: z.string().optional(),
  coverImage: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ENDED"]),
  eventUrl: z.string().min(1, { message: "Event URL is required." }),
});

export const editEvent = createEventSchema.extend({
  eventId: z.string().min(1, { message: "Event ID is required." }),
});

export const getEventSchema = z.object({
  eventId: z.string().min(1, { message: "Event ID is required." }),
});

export const createPlanSchema = z.object({
  name: z.enum(["FREE", "STANDARD", "PREMIUM", "PRO"]),
  price: z.number().min(1, { message: "Price must be at least 1." }),
  currency: z.enum(["GHS"]),
  type: z.enum(["CREDIT", "SUBSCRIPTION"]),
  credits: z.number().optional(),
  durationDays: z.number().optional(),
});

export const editPlanSchema = createPlanSchema.extend({
  planId: z.string().min(1, { message: "Plan ID is required." }),
});

export const getPlanSchema = z.object({
  planId: z.string().min(1, { message: "Plan ID is required." }),
});

export const createTransactionSchema = z.object({
  accountId: z.string().min(1, { message: "Account ID is required." }),
  planId: z.string().min(1, { message: "Plan ID is required." }),
  amount: z.number().min(1, { message: "Amount must be at least 1." }),
  currency: z.enum(["GHS"]),
  status: z.enum(["PENDING", "SUCCESS", "FAILED"]),
  reference: z.string().min(1, { message: "Reference is required." }),
});

export const getTransactionSchema = z.object({
  transactionId: z.string().min(1, { message: "Transaction ID is required." }),
});

export const createMediaSchema = z.object({
  event: z.string().min(1, { message: "Event ID is required." }),
  fileType: z.string().min(1, { message: "File type is required." }),
  fileUrl: z.string().min(1, { message: "File URL is required." }),
});

export const getMediaSchema = z.object({
  mediaId: z.string().min(1, { message: "Media ID is required." }),
});

export const getAccountSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
});
