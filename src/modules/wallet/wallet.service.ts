import { IDepositBalance, IWallet } from "./wallet.interface";
import Wallet from "./wallet.model";

const getUserWalletFromDB = async (userId: string) => {
  const wallet = await Wallet.findOne({ userId });
  return wallet;
};

const depositWalletIntoDB = async (payload: IDepositBalance) => {
  const { userId, amount } = payload;
  const wallet = await Wallet.findOneAndUpdate(
    { userId },
    { $inc: { balance: amount } }, // Increment balance
    { new: true }
  );

  return wallet;
};

const withdrawWalletFromDB = async (userId: string) => {
  const wallet = await Wallet.findOne({ userId });

  return wallet;
};

export const WalletService = {
  getUserWalletFromDB,
  depositWalletIntoDB,
  withdrawWalletFromDB,
};
