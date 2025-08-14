"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletZodSchema = void 0;
const zod_1 = require("zod");
const wallet_constrain_1 = require("./wallet.constrain");
// const objectIdSchema = z
//   .string()
//   .refine((v) => mongoose.Types.ObjectId.isValid(v), {
//     message: "Invalid MongoDB ObjectId",
//   });
const getUserWalletByEmailSchema = zod_1.z.object({
    email: zod_1.z.email({ error: "please enter a valid email" }),
});
const getWalletByUserIdSchema = zod_1.z.object({
    userId: zod_1.z.string(),
});
const depositWalletSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    amount: zod_1.z.number().positive("Amount must be greater than 0"),
});
const withdrawWalletSchema = zod_1.z.object({
    userId: zod_1.z.string(),
});
const updateWalletByEmailSchema = zod_1.z.object({
    status: zod_1.z.enum([
        wallet_constrain_1.WalletStatus.ACTIVE,
        wallet_constrain_1.WalletStatus.BLOCKED,
        wallet_constrain_1.WalletStatus.SUSPENDED,
    ]),
});
exports.WalletZodSchema = {
    getUserWalletByEmailSchema,
    getWalletByUserIdSchema,
    depositWalletSchema,
    withdrawWalletSchema,
    updateWalletByEmailSchema,
};
