import { Router } from "express";
import { WalletController } from "./wallet.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../user/user.constrain";
import { WalletZodSchema } from "./wallet.validate";
import { validateRequest } from "../../middleware/validateRequest";

const walletRoutes = Router();

walletRoutes.get(
  "/:userId",
  auth([UserRole.Admin]),

  WalletController.getUserWalletById
);
walletRoutes.get(
  "/profile/:email",
  auth(Object.values(UserRole)),

  WalletController.getUserWallet
);
walletRoutes.post(
  "/deposit",
  auth(Object.values(UserRole)),
  validateRequest(WalletZodSchema.depositWalletSchema),
  WalletController.depositToWallet
);
walletRoutes.post(
  "/withdraw",
  auth(Object.values(UserRole)),
  validateRequest(WalletZodSchema.withdrawWalletSchema),
  WalletController.withdrawFromWallet
);
walletRoutes.patch(
  "/status/:email",
  auth([UserRole.Admin]),
  validateRequest(WalletZodSchema.updateWalletByEmailSchema),
  WalletController.updateWalletStatus
);

export default walletRoutes;
