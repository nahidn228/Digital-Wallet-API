import { Request, Response } from "express";
import status from "http-status";
import User from "./user.model";

import { UserZodSchema } from "./user.validate";
import { UserServices } from "./user.service";
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
  const data = await UserServices.getUserFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User retrieved successfully",
    data: data,
  });
});

const getSingleUsers = catchAsync(async (req: Request, res: Response) => {
  const email = req.params.email;
  console.log(email);

  const user = await UserServices.getUserByEmailFromDB(email);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User retrieved successfully",
    data: user,
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
