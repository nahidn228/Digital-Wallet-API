import { Router } from "express";
import { TransactionController } from "./transaction.controller";

const transactionRoutes = Router();

transactionRoutes.post("/deposit", TransactionController.deposit);
transactionRoutes.post("/withdraw", TransactionController.withdraw);
// transactionRoutes.post("/send-money", TransactionController.sendMoney);
// transactionRoutes.patch("/:id/status", TransactionController.changeStatus);
// transactionRoutes.get("/history/:walletId", TransactionController.history);

export default transactionRoutes;
