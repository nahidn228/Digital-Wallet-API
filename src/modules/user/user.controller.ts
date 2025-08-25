import { Request, Response } from "express";
import status from "http-status";
import User from "./user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserZodSchema } from "./user.validate";
import { IUserFilters, UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/SendResponse";
import AppError from "../../error/AppError";
import mongoose from "mongoose";

// const registerUser = catchAsync(async (req: Request, res: Response) => {
//   const payload = req.body;

//   const data = await UserServices.createUserIntoDB(payload);

//   sendResponse(res, {
//     statusCode: status.CREATED,
//     success: true,
//     message: "User registered successfully",
//     data: data,
//   });
// });

// const loginUser = catchAsync(async (req: Request, res: Response) => {
//   const payload = req.body;

//   const data = await UserServices.loginUserIntoDB(payload);

//   sendResponse(res, {
//     statusCode: status.OK,
//     success: true,
//     message: "User Login successfully",
//     data: data,
//   });
// });

const getUsers = catchAsync(async (req: Request, res: Response) => {
  // Extract and parse query params
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  // Build filters object
  const filters: IUserFilters = {};

  if (req.query.email) {
    filters.email = req.query.email as string;
  }

  if (req.query.role) {
    filters.role = req.query.role as string;
  }

  // Get data from DB
  // const {
  //   users,
  //   total,
  //   page: currentPage,
  //   limit: pageSize,
  // } = await UserServices.getUserFromDB(page, limit, filters);
  const users = await UserServices.getUserFromDB(page, limit, filters);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User retrieved successfully",
    data: users,
  });
});

const getSingleUsers = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: "No token found" });
  }
  const decoded = jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET as string
  ) as JwtPayload;

  const emailFromToken = decoded.email;

  const user = await UserServices.getUserByEmailFromDB(emailFromToken);

  if (!user) {
    return res.status(401).json({ message: "No token found" });
  }
  const { password, ...userWithoutPassword } = user.toObject();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User retrieved successfully",
    data: userWithoutPassword,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const email = req.params.email;
  const payload = req.body;

  const data = await UserServices.updateUserFromDB(email, payload);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "User Updated successfully",
    data: data,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const data = await UserServices.deleteUserByIdFromDB(userId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User Deleted successfully",
    data: null,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const data = await UserServices.getUserByIdFromDB(userId);

  if (!data) {
    throw new AppError(404, "User not found", "");
  }

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User Retrieved successfully",
    data: data,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const payload = req.body;

  const data = await UserServices.updateUserStatusIntoDB(userId, payload);

  if (!data) {
    throw new AppError(status.NOT_FOUND, "User not found", "");
  }

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User Status Updated successfully",
    data: data,
  });
});

export {
  getUsers,
  getSingleUsers,
  updateUser,
  deleteUser,
  getUserById,
  updateUserStatus,
};
