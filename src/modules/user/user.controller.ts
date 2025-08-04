import { Request, Response } from "express";
import User from "./user.model";

import { UserZodSchema } from "./user.validate";

const registerUser = async (req: Request, res: Response) => {
  const payload = req.body;

  const error = await UserZodSchema.UserCreateZodSchema.parseAsync(payload);
  console.log({ error });

  const user = new User(payload);

  const data = await user.save();

  res.send({
    success: true,
    message: "User registered successfully",
    data,
  });
};

const getUsers = async (req: Request, res: Response) => {
  const data = await User.find();
  res.send({
    success: true,
    message: "User retrieved successfully",
    data,
  });
};

export { registerUser, getUsers };
