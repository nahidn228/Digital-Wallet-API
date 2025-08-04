import { Request, Response } from "express";
import User from "./user.model";
import { IUser } from "./user.interface";

const createUserIntoDB = async (payload: IUser) => {
  // const user = new User(payload);
  const data = await User.create(payload);
  return data;
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
  getUserFromDB,
  getUserByEmailFromDB,
  updateUserFromDB,
  deleteUserByIdFromDB,
};
