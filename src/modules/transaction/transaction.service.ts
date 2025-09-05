import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { generateTransactionReference } from "../../utils/generateReference";
import Wallet from "../wallet/wallet.model";
import { TransactionStatus, TransactionType } from "./transaction.constrain";
import Transaction from "./transaction.model";
import mongoose, { FilterQuery } from "mongoose";
import inputAmountValidation from "../../utils/inputAmountValidation";
import { IFilters, ITransaction } from "./transaction.interface";
import User from "../user/user.model";
import { UserRole } from "../user/user.constrain";

const depositIntoDB = async (
  senderEmail: string,
  receiverEmail: string,
  amount: number
) => {
  if (typeof amount !== "number") amount = Number(amount);
  if (amount <= 0)
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid deposit amount", "");

  const senderWallet = await Wallet.findOne({ email: senderEmail });
  const receiverWallet = await Wallet.findOne({ email: receiverEmail });

  if (!senderWallet || !receiverWallet) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Sender or receiver wallet not found",
      ""
    );
  }

  if (senderWallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance", "");
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
    type: TransactionType.DEPOSIT,
    amount,
    fee: 0,
    totalAmount: amount,
    status: TransactionStatus.COMPLETED,
    senderEmail,
    senderWalletId: senderWallet?._id,
    receiverEmail,
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
    senderEmail,
    senderWalletId: senderWallet?._id,
    receiverEmail,
    receiverWalletId: receiverWallet?._id,
    senderBalanceBefore: senderBefore,
    senderBalanceAfter: senderWallet?.balance,
    receiverBalanceBefore: receiverBefore,
    receiverBalanceAfter: receiverWallet?.balance,
  });

  return senderTransaction;
};

const withdrawFromDB = async (
  senderEmail: string,
  receiverEmail: string,
  amount: number
) => {
  if (typeof amount !== "number") amount = Number(amount);
  if (amount <= 0)
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid deposit amount", "");

  const senderWallet = await Wallet.findOne({ email: senderEmail });
  const receiverWallet = await Wallet.findOne({ email: receiverEmail });
  const receiverInfo = await User.findOne({ email: receiverEmail });

  if (receiverInfo?.role !== UserRole.Agent) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "You Have to Select an Agent Account for Withdraw",
      ""
    );
  }

  if (!senderWallet || !receiverWallet) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Sender or receiver wallet not found",
      ""
    );
  }

  if (senderWallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance", "");
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
    type: TransactionType.DEPOSIT,
    amount,
    fee: 0,
    totalAmount: amount,
    status: TransactionStatus.COMPLETED,
    senderEmail,
    senderWalletId: senderWallet?._id,
    receiverEmail,
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
    senderEmail,
    senderWalletId: senderWallet?._id,
    receiverEmail,
    receiverWalletId: receiverWallet?._id,
    senderBalanceBefore: senderBefore,
    senderBalanceAfter: senderWallet?.balance,
    receiverBalanceBefore: receiverBefore,
    receiverBalanceAfter: receiverWallet?.balance,
  });

  return senderTransaction;
};

const sendMoneyFromDB = async (
  senderEmail: string,
  receiverEmail: string,
  amount: number
) => {
  if (senderEmail === receiverEmail) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot send money to yourself",
      ""
    );
  }
  if (typeof amount !== "number") amount = Number(amount);
  if (amount <= 0)
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid deposit amount", "");

  //  const wallet = await Wallet.findById(userId);
  // const wallet = await Wallet.findOne({ email });

  const senderWallet = await Wallet.findOne({ email: senderEmail });
  const receiverWallet = await Wallet.findOne({ email: receiverEmail });

  if (!senderWallet || !receiverWallet) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Sender or receiver wallet not found",
      ""
    );
  }

  if (senderWallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance", "");
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
    senderEmail,
    senderWalletId: senderWallet?._id,
    receiverEmail,
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
    senderEmail,
    senderWalletId: senderWallet?._id,
    receiverEmail,
    receiverWalletId: receiverWallet?._id,
    senderBalanceBefore: senderBefore,
    senderBalanceAfter: senderWallet?.balance,
    receiverBalanceBefore: receiverBefore,
    receiverBalanceAfter: receiverWallet?.balance,
  });

  return { senderTransaction, receiverTransaction };
};

// const getTransactionHistoryFromDB = async (
//   walletEmail: string,
//   page: number,
//   limit: number,
//   filters: IFilters
// ) => {
//   // const { type, status, startDate, endDate } = filters;

//   const skip = (page - 1) * limit;

//   // Base condition: Only user's transactions
//   const query: FilterQuery<ITransaction> = {
//     $or: [{ senderEmail: walletEmail }, { receiverEmail: walletEmail }],
//   };

//   // Filter by type (DEPOSIT, WITHDRAW, TRANSFER)
//   if (filters.type) {
//     query.type = filters.type;
//   }

//   // Filter by status (PENDING, COMPLETED, FAILED)
//   if (filters.status) {
//     query.status = filters.status;
//   }

//   // Filter by date range
//   if (filters.startDate || filters.endDate) {
//     query.createdAt = {};
//     if (filters.startDate) {
//       query.createdAt.$gte = new Date(filters.startDate);
//     }
//     if (filters.endDate) {
//       query.createdAt.$lte = new Date(filters.endDate);
//     }
//   }

//   // Fetch paginated results & total count in parallel
//   const [transactions, total] = await Promise.all([
//     Transaction.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),

//     Transaction.countDocuments(query),
//   ]);

//   return { transactions, total, page, limit };
// };

const getTransactionHistoryFromDB = async (
  walletEmail: string,
  page: number,
  limit: number,
  filters: IFilters,
  searchFilter: Record<string, any> = {}
) => {
  const skip = (page - 1) * limit;

  // Base condition: Only user's transactions
  const query: FilterQuery<ITransaction> = {
    $or: [{ senderEmail: walletEmail }, { receiverEmail: walletEmail }],
    ...searchFilter, // ✅ merge here, not in filters
  };

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) {
      query.createdAt.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.createdAt.$lte = new Date(filters.endDate);
    }
  }

  const [transactions, total] = await Promise.all([
    Transaction.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Transaction.countDocuments(query),
  ]);

  return { transactions, total, page, limit };
};





const changeTransactionStatusIntoDB = async (
  id: string,
  status: TransactionStatus
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const transaction = await Transaction.findById(id).session(session);
    if (!transaction)
      throw new AppError(httpStatus.NOT_FOUND, "Transaction not found", "");

    if (transaction.status === status) {
      return transaction;
    }
    transaction.status = status;

    const senderWallet = await Wallet.findById(
      transaction.senderWalletId
    ).session(session);
    const receiverWallet = await Wallet.findById(
      transaction.receiverWalletId
    ).session(session);

    if (!senderWallet || !receiverWallet)
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found", "");

    const debitStatuses = ["Pending", "Failed", "Cancelled"];

    if (debitStatuses.includes(status)) {
      receiverWallet.balance -= transaction.amount;
      senderWallet.balance += transaction.amount;

      transaction.senderBalanceAfter! += transaction.amount;
      transaction.receiverBalanceAfter! -= transaction.amount;
    } else if (status === "Completed") {
      senderWallet.balance -= transaction.amount;
      receiverWallet.balance += transaction.amount;

      transaction.senderBalanceAfter! -= transaction.amount;
      transaction.receiverBalanceAfter! += transaction.amount;
    } else if (status === TransactionStatus.REVERSED) {
      if (transaction.type === "Deposit") {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "This transactions can be reversed",
          ""
        );
      }

      // Deduct amount from wallet

      receiverWallet.balance -= transaction.amount;
      senderWallet.balance += transaction.amount;

      transaction.senderBalanceAfter! += transaction.amount;
      transaction.receiverBalanceAfter! -= transaction.amount;

      transaction.status = status;

      // Create reversal audit record
      await Transaction.create(
        [
          {
            transactionId: generateTransactionReference(),
            type: TransactionType.REFUND,
            amount: transaction.amount,
            fee: 0,
            totalAmount: transaction.amount,
            status: TransactionStatus.COMPLETED,
            originalTransactionId: transaction._id,
            senderEmail: transaction.senderEmail,
            senderWalletId: transaction.senderWalletId,
            senderBalanceBefore: senderWallet.balance + transaction.amount, // Before deduction
            senderBalanceAfter: senderWallet.balance, // After deduction
          },
        ],
        { session }
      );
    }

    await senderWallet.save({ session });
    await receiverWallet.save({ session });
    await transaction.save({ session });
    await session.commitTransaction();

    return transaction;
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(httpStatus.BAD_GATEWAY, `${error.message}`, "");
  } finally {
    session.endSession();
  }
};

const getTransactionFromDB = async (
  page: number,
  limit: number,
  filters: IFilters
) => {
  const skip = (page - 1) * limit;

  const query: FilterQuery<ITransaction> = {};

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
    Transaction.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),

    Transaction.countDocuments(query),
  ]);

  return { transactions, total, page, limit };
};

export const TransactionServices = {
  depositIntoDB,
  withdrawFromDB,
  sendMoneyFromDB,
  getTransactionHistoryFromDB,
  changeTransactionStatusIntoDB,
  getTransactionFromDB,
};
