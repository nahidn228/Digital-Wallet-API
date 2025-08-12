import status from "http-status";
import bcrypt from "bcryptjs";
import config from "../../config";
import { IUser } from "../user/user.interface";
import User from "../user/user.model";
import AppError from "../../error/AppError";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { ILoginCredentials, IRegisterData } from "./auth.interface";
import Wallet from "../wallet/wallet.model";

const createUserIntoDB = async (payload: IRegisterData) => {
  payload.password = await bcrypt.hash(
    payload.password,
    Number(config.BCRYPT_SALT_ROUND)
  );
  const data = await User.create(payload);

  const wallet = await Wallet.create({
    userId: data?._id,
    email: data?.email,
    balance: 0,
    status: "Active",
  });

  return data;
};

const loginUserIntoDB = async (payload: ILoginCredentials) => {
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

  const accessToken = jwt.sign(
    jwtPayload,
    config.JWT_ACCESS_SECRET as string,
    {
      expiresIn: config.JWT_ACCESS_EXPIRES,
    } as SignOptions
  );
  const refreshToken = jwt.sign(
    jwtPayload,
    config.JWT_REFRESH_SECRET as string,
    {
      expiresIn: config.JWT_REFRESH_EXPIRES,
    } as SignOptions
  );

  return { accessToken, refreshToken };
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
  const isPasswordMatched = await bcrypt.compare(oldPassword, storedPassword);

  if (!isPasswordMatched) {
    throw new AppError(Number(status[403]), "Password Not Matched", "");
  }

  isUserExist.password = await bcrypt.hash(
    newPassword,
    Number(config.BCRYPT_SALT_ROUND)
  );

  //save password

  await isUserExist.save();

  const { password, ...rest } = isUserExist.toObject();

  return rest;
};

const resetPasswordIntoDB = async (
  email: string,
  phone: string,
  newPassword: string
) => {
  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, "User Not Found", "");
  }
  const checkPhoneNumber = isUserExist.phone === phone;

  if (!checkPhoneNumber) {
    throw new AppError(status.NOT_FOUND, "Wrong Phone Number", "");
  }

  isUserExist.password = await bcrypt.hash(
    newPassword,
    Number(config.BCRYPT_SALT_ROUND)
  );

  //save password

  await isUserExist.save();
  const { password, ...rest } = isUserExist.toObject();

  return rest;
};

const refreshTokenIntoDB = async (refreshToken: string) => {
  const verifyRefreshToken = jwt.verify(
    refreshToken,
    config.JWT_REFRESH_SECRET!
  ) as JwtPayload;

  const isUserExist = await User.findOne({ email: verifyRefreshToken.email });
  if (!isUserExist) {
    throw new AppError(status.UNAUTHORIZED, "User Not Found", "");
  }

  const jwtPayload = {
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.JWT_ACCESS_SECRET!, {
    expiresIn: config.JWT_ACCESS_EXPIRES,
  } as SignOptions);

  return { accessToken };
};

export const AuthServices = {
  createUserIntoDB,
  loginUserIntoDB,
  changePasswordIntoDB,
  resetPasswordIntoDB,
  refreshTokenIntoDB,
};
