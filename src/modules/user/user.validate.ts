import z from "zod";
import { UserRole } from "./user.constrain";

const updateUserSchema = z.object({
  name: z.string().min(3).max(255).optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
  password: z.string().optional(),
  role: z.enum(["User", "Admin", "Agent"]).optional(),
  profilePicture: z.string().optional(),
  nid: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  isVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

const getUserByIdSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export const UserZodSchema = {
  updateUserSchema,
  getUserByIdSchema,
};
