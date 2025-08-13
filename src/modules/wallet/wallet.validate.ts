import { string, z } from "zod";
import mongoose from "mongoose";
import { WalletStatus } from "./wallet.constrain";

// const objectIdSchema = z
//   .string()
//   .refine((v) => mongoose.Types.ObjectId.isValid(v), {
//     message: "Invalid MongoDB ObjectId",
//   });

const getUserWalletByEmailSchema = z.object({
  email: z.email({ error: "please enter a valid email" }),
});

const getWalletByUserIdSchema = z.object({
  userId: z.string(),
});

const depositWalletSchema = z.object({
  userId: z.string(),
  amount: z.number().positive("Amount must be greater than 0"),
});

const withdrawWalletSchema = z.object({
  userId: z.string(),
});

const updateWalletByEmailSchema = z.object({
  email: z.email({ error: "please enter a valid email" }),
  payload: z.string(),
});

export const WalletZodSchema = {
  getUserWalletByEmailSchema,
  getWalletByUserIdSchema,
  depositWalletSchema,
  withdrawWalletSchema,
  updateWalletByEmailSchema,
};
