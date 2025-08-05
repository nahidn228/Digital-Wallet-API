import z from "zod";
import { UserRole } from "./user.constrain";

const createUserZodSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be minimum 3 character")
    .max(255, "Name must be maximum 255 character"),
  email: z.email({ error: "please enter a valid email" }),
  phone: z.string(),
  password: z.string(),
  role: z.enum(UserRole),
  profilePicture: z
    .string()
    .url("Profile picture must be a valid URL")
    .optional()
    .or(z.literal("")),

  nid: z
    .string()
    .min(10, "NID must be at least 10 characters")
    .max(20, "NID must be maximum 20 characters")
    .regex(/^[0-9]+$/, "NID must contain only numbers")
    .optional(),

  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must be maximum 500 characters")
    .optional(),

  dateOfBirth: z
    .string()
    .datetime("Please provide a valid date")
    .or(z.date())
    .transform((date) => new Date(date))
    .refine((date) => {
      const age = new Date().getFullYear() - date.getFullYear();
      return age >= 18 && age <= 100;
    }, "User must be between 18 and 100 years old")
    .optional(),
  isVerified: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

const loginUserZodSchema = z.object({
  email: z.email({ error: "please enter a valid email" }),

  password: z.string(),
});

export const UserZodSchema = {
  createUserZodSchema,
  loginUserZodSchema,
};
