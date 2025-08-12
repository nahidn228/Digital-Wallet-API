import { Router } from "express";
import userRouts from "../user/user.route";
import authRouts from "../auth/auth.route";
import walletRoutes from "../wallet/wallet.route";


const routes = Router();

routes.use("/user", userRouts);
routes.use("/auth", authRouts);
// routes.use("/transaction", transactionRoutes);
routes.use("/wallet", walletRoutes);

export default routes;
