import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import routes from "./modules/routes";
import globalErrorHandler from "./middleware/globalErrorHandler";
import config from "./config";

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
  res.send({
    success: true,
    message: "Digital Wallet API is Running",
  });
});

app.use(globalErrorHandler);

export default app;
