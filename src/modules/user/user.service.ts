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

// const getAllMangoFromDB = async () => {
//   const data = await Mango.find();

//   return data;
// };

// const updateMangoByIdFromDB = async (mangoId: string, payload: any) => {
//   const data = await Mango.findByIdAndUpdate(mangoId, payload, {
//     new: true,
//     runValidators: true,
//   });

//   return data;
// };
// const deleteMangoByIdFromDB = async (mangoId: string) => {
//   const data = await Mango.findByIdAndDelete(mangoId);

//   return data;
// };

export const UserServices = {
  createUserIntoDB,
  getUserFromDB,
  getUserByEmailFromDB,
};
