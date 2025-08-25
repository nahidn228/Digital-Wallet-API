import mongoose from "mongoose";
import { UserRole } from "./user.constrain";

export interface IUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  profilePicture?: string;
  nid?: string;
  address?: string;
  dateOfBirth?: Date;
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserProfile {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  profilePicture?: string;
  nid?: string;
  address?: string;
  dateOfBirth?: Date;
  isVerified: boolean;
  role: UserRole;
  createdAt?: Date;
}
