import { Router } from "express";
import { TransactionController } from "./transaction.controller";

const transactionRoutes = Router();

transactionRoutes.post("/deposit", TransactionController.deposit);
transactionRoutes.post("/withdraw", TransactionController.withdraw);
transactionRoutes.post("/sendMoney", TransactionController.sendMoney);
transactionRoutes.get(
  "/history/:walletId",
  TransactionController.getTransactionHistory
);

// transactionRoutes.patch("/:id/status", TransactionController.changeStatus);

export default transactionRoutes;
