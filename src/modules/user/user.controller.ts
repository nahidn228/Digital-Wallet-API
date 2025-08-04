import { Request, Response } from "express";
import User from "./user.model";

import { UserZodSchema } from "./user.validate";
import { UserServices } from "./user.service";

const registerUser = async (req: Request, res: Response) => {
  const payload = req.body;

  const error = await UserZodSchema.UserCreateZodSchema.parseAsync(payload);
  console.log({ error });

  const data = await UserServices.createUserIntoDB(payload);

  res.send({
    success: true,
    message: "User registered successfully",
    data,
  });
};

const getUsers = async (req: Request, res: Response) => {
  const data = await UserServices.getUserFromDB();
  res.send({
    success: true,
    message: "User retrieved successfully",
    data,
  });
};
const getSingleUsers = async (req: Request, res: Response) => {
  const email = req.params.email;
  const data = await UserServices.getUserByEmailFromDB(email);
  res.send({
    success: true,
    message: "User retrieved successfully",
    data,
  });
};

export { registerUser, getUsers, getSingleUsers };
