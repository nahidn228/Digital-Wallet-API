import status from "http-status";
import AppError from "../../error/AppError";
import { generateTransactionReference } from "../../utils/generateReference";
import Wallet from "../wallet/wallet.model";
import { TransactionStatus, TransactionType } from "./transaction.constrain";
import Transaction from "./transaction.model";
import mongoose from "mongoose";

const depositIntoDB = async (userId: string, amount: number) => {
  if (typeof amount === "string") amount = Number(amount);
  if (typeof amount !== "number")
    throw new AppError(status.BAD_REQUEST, "Invalid deposit amount", "");
  if (amount <= 0)
    throw new AppError(status.BAD_REQUEST, "Invalid deposit amount", "");

  const wallet = await Wallet.findById(userId);

  if (!wallet) throw new AppError(status.NOT_FOUND, "Wallet not found", "");

  const before = wallet?.balance;
  wallet.balance += amount;
  await wallet.save();

  const transaction = await Transaction.create({
    transactionId: generateTransactionReference(),
    type: TransactionType.DEPOSIT,
    amount,
    fee: 0,
    totalAmount: amount,
    status: TransactionStatus.COMPLETED,
    senderId: new mongoose.Types.ObjectId(userId),
    senderWalletId: wallet?._id,
    senderBalanceBefore: before,
    senderBalanceAfter: wallet?.balance,
  });

  return transaction;
};

const withdrawFromDB = async (userId: string, amount: number) => {
  if (typeof amount === "string") amount = Number(amount);
  if (typeof amount !== "number")
    throw new AppError(status.BAD_REQUEST, "Invalid deposit amount", "");
  if (amount <= 0)
    throw new AppError(status.BAD_REQUEST, "Invalid deposit amount", "");

  const wallet = await Wallet.findById(userId);

  if (!wallet) throw new AppError(status.NOT_FOUND, "Wallet not found", "");

  if (wallet.balance < amount) {
    throw new AppError(status.BAD_REQUEST, "Insufficient balance", "");
  }

  const before = wallet.balance;
  wallet.balance -= amount;
  await wallet.save();

  const transaction = await Transaction.create({
    transactionId: generateTransactionReference(),
    type: TransactionType.WITHDRAW,
    amount,
    fee: 0,
    totalAmount: amount,
    status: TransactionStatus.COMPLETED,
    senderId: userId,
    senderWalletId: wallet._id,
    senderBalanceBefore: before,
    senderBalanceAfter: wallet.balance,
  });
  return transaction;
};

export const TransactionServices = {
  depositIntoDB,
  withdrawFromDB
};
