import status from "http-status";
import bcrypt from "bcryptjs";
import config from "../../config";
import { IUser } from "../user/user.interface";
import User from "../user/user.model";
import AppError from "../../error/AppError";
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

const changePasswordIntoDB = async (
  email: string,
  newPassword: string,
  oldPassword: string
) => {
  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, "User Not Found", "");
  }

  const storedPassword = isUserExist.password;
  const isPasswordMatched = bcrypt.compare(oldPassword, storedPassword);

  if (!isPasswordMatched) {
    throw new AppError(Number(status[403]), "Password Not Matched", "");
  }

  isUserExist.password = await bcrypt.hash(
    newPassword,
    Number(config.BCRYPT_SALT_ROUND)
  );

  //save password

  await isUserExist.save();

  return isUserExist;
};

export const AuthServices = {
  createUserIntoDB,
  loginUserIntoDB,
  changePasswordIntoDB,
};
