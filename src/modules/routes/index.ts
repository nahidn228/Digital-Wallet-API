import { Router } from "express";
import userRouts from "../user/user.route";
import authRouts from "../auth/auth.route";
import walletRoutes from "../wallet/wallet.route";
import transactionRoutes from "../transaction/transaction.route";


const routes = Router();

routes.use("/user", userRouts);
routes.use("/auth", authRouts);
routes.use("/wallet", walletRoutes);
routes.use("/transaction", transactionRoutes);

export default routes;
