import { z } from "zod";
import mongoose from "mongoose";
import { TransactionStatus, TransactionType } from "./transaction.constrain";

// const objectIdSchema = z
//   .string()
//   .refine((val) => mongoose.Types.ObjectId.isValid(val), {
//     message: "Invalid ObjectId format",
//   });

/* 1. Deposit */
const depositSchema = z.object({
  userId: z.string(),
  amount: z.number().positive("Amount must be greater than 0"),
});

/* 2. Withdraw */
const withdrawSchema = z.object({
  userId: z.string(),
  amount: z.number().positive("Amount must be greater than 0"),
});

/* 3. Send Money */
const sendMoneySchema = z.object({
  senderId: z.string(),
  receiverId: z.string(),
  amount: z.number().positive("Amount must be greater than 0"),
});

/* 4. Change Transaction Status */
const changeTransactionStatusSchema = z.object({
  status: z.enum(Object.values(TransactionStatus) as [string, ...string[]]),
});

export const transactionZodSchema = {
  changeTransactionStatusSchema,
  sendMoneySchema,
  withdrawSchema,
  depositSchema,
};
