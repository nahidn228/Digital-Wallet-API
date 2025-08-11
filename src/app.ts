import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import routes from "./modules/routes";

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

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const errorSources: { path: any; message: any }[] = [];
  const errors = Object.values(err.errors);

  errors.forEach((error) => {
    errorSources.push({ path: error.path, message: error.message });
  });

  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong",
    error: errorSources,
  });
});

export default app;
