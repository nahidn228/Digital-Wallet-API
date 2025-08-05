import { Request, Response } from "express";
import User from "./user.model";
import { IUser } from "./user.interface";
import bcrypt from "bcryptjs";
import config from "../../config";
import AppError from "../../error/AppError";
import status from "http-status";
import jwt from "jsonwebtoken";

const createUserIntoDB = async (payload: IUser) => {
  payload.password = await bcrypt.hash(
    payload.password,
    Number(config.BCRYPT_SALT_ROUND)
  );
  const data = await User.create(payload);
  return data;
};

const loginUserIntoDB = async (payload: IUser) => {
  const isUserExist = await User.findOne({ email: payload.email });
  if (!isUserExist) {
    throw new AppError(status.UNAUTHORIZED, "User Not Found", ""); //status_code, message, stack
  }

  const checkPassword = await bcrypt.compare(
    payload.password,
    isUserExist.password
  );

  if (!checkPassword) {
    throw new AppError(
      status.BAD_REQUEST,
      "Email and password are not Matched",
      ""
    );
  }

  const jwtPayload = {
    email: payload.email,
    role: isUserExist.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.JWT_ACCESS_SECRET as string, {
    expiresIn: "7d",
  });

  return accessToken;
};

const getUserFromDB = async () => {
  const data = await User.find();
  return data;
};

const getUserByEmailFromDB = async (payload: string) => {
  const data = await User.findOne({ email: payload });
  console.log(data);
  return data;
};

const updateUserFromDB = async (email: string, payload: Partial<IUser>) => {
  const data = await User.findOneAndUpdate({ email }, payload, {
    new: true,
    runValidators: true,
  });
  return data;
};

const deleteUserByIdFromDB = async (userId: string) => {
  const data = await User.findByIdAndDelete(userId);
  return data;
};

export const UserServices = {
  createUserIntoDB,
  loginUserIntoDB,
  getUserFromDB,
  getUserByEmailFromDB,
  updateUserFromDB,
  deleteUserByIdFromDB,
};
