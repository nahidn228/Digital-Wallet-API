import cors from "cors";
import http from "http-status";
import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import routes from "./modules/routes";
import { ZodError } from "zod";
import { TErrorSources } from "./interfeces/error.interface";
import mongoose from "mongoose";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
  res.send({
    success: true,
    message: "Digital Wallet API is Running",
  });
});

app.use(globalErrorHandler);

export default app;
