import { Request, Response } from "express";
import User from "./user.model";
import { IUpdateUser, IUser } from "./user.interface";
import bcrypt from "bcryptjs";
import config from "../../config";
import AppError from "../../error/AppError";
import status from "http-status";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { FilterQuery } from "mongoose";

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

export interface IUserFilters {
  email?: string;
  role?: string;
}

const getUserFromDB = async (
  page: number = 1,
  limit: number = 10,
  filters: IUserFilters = {}
) => {
  const skip = (page - 1) * limit;

  // Base query
  const query: FilterQuery<IUser> = {};

  // Filter by email (partial match)
  if (filters.email) {
    query.email = { $regex: filters.email, $options: "i" };
  }

  // Filter by role
  if (filters.role) {
    query.role = filters.role;
  }

  // Fetch paginated results & total count in parallel
  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(query),
  ]);

  return { users, total, page, limit };
};

const getUserByEmailFromDB = async (payload: string) => {
  const user = await User.findOne({ email: payload });

  if (!user) {
    throw new AppError(status.BAD_REQUEST, "User Doesn't Exist", "");
  }

  return user;
};

const updateUserFromDB = async (email: string, payload: IUpdateUser) => {
  if (payload.email) {
    throw new AppError(
      status.FORBIDDEN,
      "You do not have Access For This Operation",
      ""
    );
  }

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

const getUserByIdFromDB = async (userId: string) => {
  // const data = await User.findById(userId);

  const user = await User.findById(userId).populate({
    path: "wallet",
    select: "balance status -_id", // Only return specific fields
  });

  return user;
};

const updateUserStatusIntoDB = async (
  userId: string,
  payload: Partial<IUser>
) => {
  // const data = await User.findOneAndUpdate({ _id: userId }, payload, {
  //   new: true,
  //   runValidators: true,
  // });
  console.log(payload);
  const data = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return data;
};

export const UserServices = {
  getUserFromDB,
  getUserByEmailFromDB,
  updateUserFromDB,
  deleteUserByIdFromDB,
  getUserByIdFromDB,
  updateUserStatusIntoDB,
  loginUserIntoDB,
  createUserIntoDB,
};
