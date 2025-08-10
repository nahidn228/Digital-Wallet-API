import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import AppError from "../error/AppError";
import status from "http-status";
import config from "../config";
import User from "../modules/user/user.model";

export const auth =
  (role: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(status.FORBIDDEN, "Unauthorized Access", "");
    }

    const isVerifiedToken = jwt.verify(
      token,
      config.JWT_ACCESS_SECRET as string
    ) as JwtPayload;

    // console.log(isVerifiedToken);

    const isUserExist = await User.findOne({ email: isVerifiedToken.email });

    if (!isUserExist) {
      throw new AppError(status.UNAUTHORIZED, "User Not Found", "");
    }

    if (!role.includes(isVerifiedToken.role)) {
      throw new AppError(status.UNAUTHORIZED, "Unauthorized access", "");
    }

    req.user = isUserExist;

    next();
  };
