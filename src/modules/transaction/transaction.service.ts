import status from "http-status";
import AppError from "../../error/AppError";
import { generateTransactionReference } from "../../utils/generateReference";
import Wallet from "../wallet/wallet.model";
import { TransactionStatus, TransactionType } from "./transaction.constrain";
import Transaction from "./transaction.model";
import mongoose from "mongoose";
import inputAmountValidation from "../../utils/inputAmountValidation";

const depositIntoDB = async (userId: string, amount: number) => {
  if (typeof amount !== "number") amount = Number(amount);
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
  if (typeof amount !== "number") amount = Number(amount);
  inputAmountValidation(amount);

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

const sendMoneyFromDB = async (
  senderId: string,
  receiverId: string,
  amount: number
) => {
  if (senderId === receiverId) {
    throw new AppError(status.BAD_REQUEST, "Cannot send money to yourself", "");
  }
  if (typeof amount !== "number") amount = Number(amount);
  if (amount <= 0)
    throw new AppError(status.BAD_REQUEST, "Invalid deposit amount", "");

  //  const wallet = await Wallet.findById(userId);

  const senderWallet = await Wallet.findById(senderId);
  const receiverWallet = await Wallet.findById(receiverId);

  if (!senderWallet || !receiverWallet) {
    throw new AppError(
      status.NOT_FOUND,
      "Sender or receiver wallet not found",
      ""
    );
  }

  if (senderWallet.balance < amount) {
    throw new AppError(status.BAD_REQUEST, "Insufficient balance", "");
  }

  // Update balances
  const senderBefore = senderWallet?.balance;
  const receiverBefore = receiverWallet?.balance;

  senderWallet.balance -= amount;
  receiverWallet.balance += amount;

  await senderWallet.save();
  await receiverWallet.save();

  // Create sender transaction
  const senderTransaction = await Transaction.create({
    transactionId: generateTransactionReference(),
    type: TransactionType.SEND_MONEY,
    amount,
    fee: 0,
    totalAmount: amount,
    status: TransactionStatus.COMPLETED,
    senderId,
    senderWalletId: senderWallet?._id,
    receiverId,
    receiverWalletId: receiverWallet?._id,
    senderBalanceBefore: senderBefore,
    senderBalanceAfter: senderWallet?.balance,
    receiverBalanceBefore: receiverBefore,
    receiverBalanceAfter: receiverWallet?.balance,
  });

  // Create receiver transaction
  const receiverTransaction = await Transaction.create({
    transactionId: generateTransactionReference(),
    type: TransactionType.CASH_IN,
    amount,
    fee: 0,
    totalAmount: amount,
    status: TransactionStatus.COMPLETED,
    senderId,
    senderWalletId: senderWallet?._id,
    receiverId,
    receiverWalletId: receiverWallet?._id,
    senderBalanceBefore: senderBefore,
    senderBalanceAfter: senderWallet?.balance,
    receiverBalanceBefore: receiverBefore,
    receiverBalanceAfter: receiverWallet?.balance,
  });

  return { senderTransaction, receiverTransaction };
};

export const TransactionServices = {
  depositIntoDB,
  withdrawFromDB,
  sendMoneyFromDB,
};
