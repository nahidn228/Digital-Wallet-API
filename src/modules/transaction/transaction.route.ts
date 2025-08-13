import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { transactionZodSchema } from "./transaction.validate";
import { auth } from "../../middleware/auth";
import { UserRole } from "../user/user.constrain";

const transactionRoutes = Router();

transactionRoutes.post(
  "/deposit",
  auth(Object.values(UserRole)),
  validateRequest(transactionZodSchema.depositSchema),
  TransactionController.deposit
);
transactionRoutes.post(
  "/withdraw",
  auth(Object.values(UserRole)),
  validateRequest(transactionZodSchema.withdrawSchema),
  TransactionController.withdraw
);
transactionRoutes.post(
  "/sendMoney",
  auth(Object.values(UserRole)),
  validateRequest(transactionZodSchema.sendMoneySchema),
  TransactionController.sendMoney
);
transactionRoutes.get(
  "/history/:walletId",
  auth(Object.values(UserRole)),
  TransactionController.getTransactionHistory
);

transactionRoutes.patch(
  "/status/:id",
  auth([UserRole.Admin]),
  validateRequest(transactionZodSchema.changeTransactionStatusSchema),
  TransactionController.changeTransactionStatus
);
transactionRoutes.get(
  "/transaction",
  auth([UserRole.Admin]),
  TransactionController.getAllTransaction
);

export default transactionRoutes;
