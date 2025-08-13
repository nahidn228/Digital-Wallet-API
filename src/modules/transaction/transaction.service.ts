import status from "http-status";
import AppError from "../../error/AppError";
import { generateTransactionReference } from "../../utils/generateReference";
import Wallet from "../wallet/wallet.model";
import { TransactionStatus, TransactionType } from "./transaction.constrain";
import Transaction from "./transaction.model";
import mongoose, { FilterQuery } from "mongoose";
import inputAmountValidation from "../../utils/inputAmountValidation";
import { IFilters, ITransaction } from "./transaction.interface";

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

const getTransactionHistoryFromDB = async (
  walletId: string,
  page: number,
  limit: number,
  filters: IFilters
) => {
  // const { type, status, startDate, endDate } = filters;
  
  const skip = (page - 1) * limit;

  // Base condition: Only user's transactions
  const query: FilterQuery<ITransaction> = {
    $or: [
      { senderWalletId: walletId },
      { receiverWalletId: walletId }
    ]
  };

  // Filter by type (DEPOSIT, WITHDRAW, TRANSFER)
  if (filters.type) {
    query.type = filters.type;
  }

  // Filter by status (PENDING, COMPLETED, FAILED)
  if (filters.status) {
    query.status = filters.status;
  }

  // Filter by date range
  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) {
      query.createdAt.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.createdAt.$lte = new Date(filters.endDate);
    }
  }

  // Fetch paginated results & total count in parallel
  const [transactions, total] = await Promise.all([
    Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Transaction.countDocuments(query)
  ]);

  return { transactions, total, page, limit };
 
};

export const TransactionServices = {
  depositIntoDB,
  withdrawFromDB,
  sendMoneyFromDB,
  getTransactionHistoryFromDB,
};
