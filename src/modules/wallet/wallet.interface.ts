import mongoose from "mongoose";
import { IUser } from "../user/user.interface";
import { WalletStatus } from "./wallet.constrain";

export interface IWallet {
  userId: string | IUser;
  balance: number;
  email: string;
  status: WalletStatus;
  pin?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWalletBalance {
  balance: number;
  email: string;
  availableBalance: number;
  pendingAmount: number;
}
export interface IDepositBalance {
  userId: mongoose.Types.ObjectId;
  amount: number;
}
