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
  let statusCode = 500;
  let message = "Internal Server Error";
  let errorSources: { path: any; message: any }[] = [];

  if (err.code === 11000) {
    const duplicate = err.message.match(/"([^"]*)"/)[1];
    message = `${duplicate} is already exist`;
    // message = err.message.match(/"([^"]*)"/);
  } else if (err.name === "ValidationError") {
    const errors = Object.values(err.errors);

    errors.forEach((error) => {
      errorSources.push({ path: error.path, message: error.message });
    });
  }
  res.status(statusCode).json({
    success: false,
    message: message,
    error: errorSources,
    errorDetails: err,
  });
});

export default app;
