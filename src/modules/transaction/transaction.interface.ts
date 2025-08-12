import { IUser } from "../user/user.interface";
import { WalletStatus } from "./wallet.constrain";

export interface IWallet {
  _id?: string;
  userId: string | IUser;
  balance: number;
  status: WalletStatus;
  pin?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWalletBalance {
  balance: number;
  availableBalance: number;
  pendingAmount: number;
}