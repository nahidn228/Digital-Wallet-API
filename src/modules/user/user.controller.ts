import { Request, Response } from "express";
import User from "./user.model";

import { UserZodSchema } from "./user.validate";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  // const error = await UserZodSchema.UserCreateZodSchema.parseAsync(payload);
  // console.log({ error });

  const data = await UserServices.createUserIntoDB(payload);

  res.send({
    success: true,
    message: "User registered successfully",
    data,
  });
});

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const data = await UserServices.getUserFromDB();
  res.send({
    success: true,
    message: "User retrieved successfully",
    data,
  });
});

const getSingleUsers = catchAsync(async (req: Request, res: Response) => {
  const email = req.params.email;
  const data = await UserServices.getUserByEmailFromDB(email);
  res.send({
    success: true,
    message: "User retrieved successfully",
    data,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const email = req.params.email;
  const payload = req.body;
  const data = await UserServices.updateUserFromDB(email, payload);
  res.send({
    success: true,
    message: "User Updated successfully",
    data,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const data = await UserServices.deleteUserByIdFromDB(userId);

  res.send({
    success: true,
    message: "User Deleted successfully",
    data,
  });
});

export { registerUser, getUsers, getSingleUsers, updateUser, deleteUser };
