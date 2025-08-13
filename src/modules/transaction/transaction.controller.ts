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
import { IFilters } from "./transaction.interface";

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

const withdraw = catchAsync(async (req: Request, res: Response) => {
  const { userId, amount } = req.body;
  const transaction = await TransactionServices.withdrawFromDB(userId, amount);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Withdraw successful",
    data: transaction,
  });
});

const sendMoney = catchAsync(async (req: Request, res: Response) => {
  const { senderId, receiverId, amount } = req.body;

  const transaction = await TransactionServices.sendMoneyFromDB(
    senderId,
    receiverId,
    amount
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Money sent successfully",
    data: transaction,
  });
});

const getTransactionHistory = catchAsync(
  async (req: Request, res: Response) => {
    const { walletId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const filters: IFilters = {
      type: req.query.type as string,
      status: req.query.status as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
    };

    const transactionHistory = await TransactionServices.getTransactionHistoryFromDB(
      walletId,
      page,
      limit,
      filters
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Transaction history retrieved",
      data: transactionHistory,
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

const transactionHistory = catchAsync(async (req: Request, res: Response) => {
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
});

export const TransactionController = {
  deposit,
  withdraw,
  sendMoney,
  getTransactionHistory,
};
