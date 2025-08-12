import { IDepositBalance, IWallet } from "./wallet.interface";
import Wallet from "./wallet.model";

const getUserWalletFromDB = async (email: string) => {
  const wallet = await Wallet.findOne({ email });
  return wallet;
};

const getSingleWalletByIdFromDB = async (userId: string) => {
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

const updateWalletFromDB = async (email: string, payload: Partial<IWallet>) => {
  const data = await Wallet.findOneAndUpdate({ email }, payload, {
    new: true,
    runValidators: true,
  });
  return data;
};

export const WalletService = {
  getUserWalletFromDB,
  getSingleWalletByIdFromDB,
  depositWalletIntoDB,
  withdrawWalletFromDB,
  updateWalletFromDB,
};
