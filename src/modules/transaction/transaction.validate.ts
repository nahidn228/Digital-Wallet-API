import { z } from "zod";
import mongoose from "mongoose";
import { TransactionStatus, TransactionType } from "./transaction.constrain";

const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
  });

/* 1. Deposit */
const depositSchema = z.object({
  body: z.object({
    userId: objectIdSchema,
    amount: z.number().positive("Amount must be greater than 0"),
  }),
});

/* 2. Withdraw */
const withdrawSchema = z.object({
  body: z.object({
    userId: objectIdSchema,
    amount: z.number().positive("Amount must be greater than 0"),
  }),
});

/* 3. Send Money */
const sendMoneySchema = z.object({
  body: z.object({
    senderId: objectIdSchema,
    receiverId: objectIdSchema,
    amount: z.number().positive("Amount must be greater than 0"),
  }),
});

/* 4. Transaction History (params + query) */
const getTransactionHistorySchema = z.object({
  params: z.object({
    walletId: objectIdSchema,
  }),
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    type: z
      .enum(Object.values(TransactionType) as [string, ...string[]])
      .optional(),
    status: z
      .enum(Object.values(TransactionStatus) as [string, ...string[]])
      .optional(),
    startDate: z.string().optional(), // could refine to date format
    endDate: z.string().optional(),
  }),
});

/* 5. Change Transaction Status */
const changeTransactionStatusSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    status: z.enum(Object.values(TransactionStatus) as [string, ...string[]]),
  }),
});

export const transactionZodSchema = {
  changeTransactionStatusSchema,
  getTransactionHistorySchema,
  sendMoneySchema,
  withdrawSchema,
  depositSchema,
};
