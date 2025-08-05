import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import AppError from "../error/AppError";
import status from "http-status";
import config from "../config";

export const auth =
  (role: string) => async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(status.FORBIDDEN, "Unauthorized Access", "");
    }

    const isVerifiedToken = jwt.verify(
      token,
      config.JWT_ACCESS_SECRET as string
    );

    console.log(isVerifiedToken);

    next();
  };
