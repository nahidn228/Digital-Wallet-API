import { Router } from "express";
import { WalletController } from "./wallet.controller";

const walletRoutes = Router();

walletRoutes.get("/:userId", WalletController.getUserWallet);
walletRoutes.post("/deposit", WalletController.depositToWallet);
walletRoutes.post("/withdraw", WalletController.withdrawFromWallet);

export default walletRoutes;
