import { Router } from "express";
import userRouts from "../user/user.route";
import authRouts from "../auth/auth.route";


const routes = Router();

routes.use("/user", userRouts);
routes.use("/auth", authRouts);
// routes.use("/transaction", transactionRoutes);
// routes.use("/wallet", walletRoute);

export default routes;
