import { Request, Response } from "express";
import status from "http-status";
import User from "./user.model";

import { UserZodSchema } from "./user.validate";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/SendResponse";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  // const error = await UserZodSchema.UserCreateZodSchema.parseAsync(payload);
  // console.log({ error });

  const data = await UserServices.createUserIntoDB(payload);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "User registered successfully",
    data: data,
  });
});

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
  const data = await UserServices.getUserByEmailFromDB(email);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User retrieved successfully",
    data: data,
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

export { registerUser, getUsers, getSingleUsers, updateUser, deleteUser };
