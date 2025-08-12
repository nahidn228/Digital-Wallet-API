import { Request, Response } from "express";

import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import Wallet from "../wallet/wallet.model";
import AppError from "../../error/AppError";
import { generateTransactionReference } from "../../utils/generateReference";
import { TransactionStatus, TransactionType } from "./transaction.constrain";
import { sendResponse } from "../../utils/SendResponse";
import Transaction from "./transaction.model";
import { TransactionServices } from "./transaction.service";

const deposit = catchAsync(async (req: Request, res: Response) => {
  const { userId, amount } = req.body;
  const transaction = await TransactionServices.depositIntoDB(userId, amount);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Deposit successful",
    data: transaction,
  });
});

export const withdraw = catchAsync(async (req: Request, res: Response) => {
  const { userId, amount } = req.body;
  const transaction = await TransactionServices.withdrawFromDB(userId, amount);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Withdraw successful",
    data: transaction,
  });
});

export const transactionSendMoney = catchAsync(
  async (req: Request, res: Response) => {
    const { senderId, receiverId, amount } = req.body;

    if (senderId === receiverId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Cannot send money to yourself",
        ""
      );
    }

    const senderWallet = await Wallet.findOne({ userId: senderId });
    const receiverWallet = await Wallet.findOne({ userId: receiverId });

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
    const senderBefore = senderWallet.balance;
    const receiverBefore = receiverWallet.balance;

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
      senderWalletId: senderWallet._id,
      receiverId,
      receiverWalletId: receiverWallet._id,
      senderBalanceBefore: senderBefore,
      senderBalanceAfter: senderWallet.balance,
      receiverBalanceBefore: receiverBefore,
      receiverBalanceAfter: receiverWallet.balance,
    });

    // Create receiver transaction
    await Transaction.create({
      transactionId: generateTransactionReference(),
      type: TransactionType.CASH_IN,
      amount,
      fee: 0,
      totalAmount: amount,
      status: TransactionStatus.COMPLETED,
      senderId,
      senderWalletId: senderWallet._id,
      receiverId,
      receiverWalletId: receiverWallet._id,
      senderBalanceBefore: senderBefore,
      senderBalanceAfter: senderWallet.balance,
      receiverBalanceBefore: receiverBefore,
      receiverBalanceAfter: receiverWallet.balance,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Money sent successfully",
      data: senderTransaction,
    });
  }
);

export const changeTransactionStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const transaction = await Transaction.findById(id);
    if (!transaction)
      throw new AppError(httpStatus.NOT_FOUND, "Transaction not found", "");

    transaction.status = status;
    await transaction.save();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Transaction status updated",
      data: transaction,
    });
  }
);

export const transactionHistory = catchAsync(
  async (req: Request, res: Response) => {
    const { walletId } = req.params;

    const transactions = await Transaction.find({
      $or: [{ senderWalletId: walletId }, { receiverWalletId: walletId }],
    }).sort({ createdAt: -1 });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Transaction history retrieved",
      data: transactions,
    });
  }
);

export const TransactionController = {
  deposit,
  withdraw,
};
