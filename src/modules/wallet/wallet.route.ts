import { Router } from "express";
import { WalletController } from "./wallet.controller";

const walletRoutes = Router();

walletRoutes.get("/:userId", WalletController.getUserWalletById);
walletRoutes.get("/profile/:email", WalletController.getUserWallet);
walletRoutes.post("/deposit", WalletController.depositToWallet);
walletRoutes.post("/withdraw", WalletController.withdrawFromWallet);
walletRoutes.post("/status/:email", WalletController.updateWalletStatus);

export default walletRoutes;
