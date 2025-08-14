"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionZodSchema = void 0;
const zod_1 = require("zod");
const transaction_constrain_1 = require("./transaction.constrain");
// const objectIdSchema = z
//   .string()
//   .refine((val) => mongoose.Types.ObjectId.isValid(val), {
//     message: "Invalid ObjectId format",
//   });
/* 1. Deposit */
const depositSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    amount: zod_1.z.number().positive("Amount must be greater than 0"),
});
/* 2. Withdraw */
const withdrawSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    amount: zod_1.z.number().positive("Amount must be greater than 0"),
});
/* 3. Send Money */
const sendMoneySchema = zod_1.z.object({
    senderId: zod_1.z.string(),
    receiverId: zod_1.z.string(),
    amount: zod_1.z.number().positive("Amount must be greater than 0"),
});
/* 4. Change Transaction Status */
const changeTransactionStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(Object.values(transaction_constrain_1.TransactionStatus)),
});
exports.transactionZodSchema = {
    changeTransactionStatusSchema,
    sendMoneySchema,
    withdrawSchema,
    depositSchema,
};
