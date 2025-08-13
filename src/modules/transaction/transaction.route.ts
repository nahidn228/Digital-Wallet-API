import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { transactionZodSchema } from "./transaction.validate";

const transactionRoutes = Router();

transactionRoutes.post(
  "/deposit",
  validateRequest(transactionZodSchema.depositSchema),
  TransactionController.deposit
);
transactionRoutes.post(
  "/withdraw",
  validateRequest(transactionZodSchema.withdrawSchema),
  TransactionController.withdraw
);
transactionRoutes.post(
  "/sendMoney",
  validateRequest(transactionZodSchema.sendMoneySchema),
  TransactionController.sendMoney
);
transactionRoutes.get(
  "/history/:walletId",
  validateRequest(transactionZodSchema.getTransactionHistorySchema),
  TransactionController.getTransactionHistory
);

transactionRoutes.patch(
  "/status/:id",
  validateRequest(transactionZodSchema.changeTransactionStatusSchema),
  TransactionController.changeTransactionStatus
);

export default transactionRoutes;
