import z from "zod";
import { UserRole } from "./user.constrain";

const updateUserSchema = z.object({
  //Email can not be modified
  name: z.string().min(1).optional(),
  phone: z.string().min(11).optional(),
  password: z.string().min(6).optional(),
  role: z.enum(UserRole).optional(),
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
