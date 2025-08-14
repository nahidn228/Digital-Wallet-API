import { string, z } from "zod";
import mongoose from "mongoose";
import { WalletStatus } from "./wallet.constrain";
import { partial } from "zod/v4/core/util.cjs";
import { IWallet } from "./wallet.interface";

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
  status: z.enum([
    WalletStatus.ACTIVE,
    WalletStatus.BLOCKED,
    WalletStatus.SUSPENDED,
  ]),
});

export const WalletZodSchema = {
  getUserWalletByEmailSchema,
  getWalletByUserIdSchema,
  depositWalletSchema,
  withdrawWalletSchema,
  updateWalletByEmailSchema,
};
