import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { WalletService } from "./wallet.service";
import status from "http-status";
import AppError from "../../error/AppError";
import { sendResponse } from "../../utils/SendResponse";
import Wallet from "./wallet.model";

const getUserWallet = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const wallet = await WalletService.getUserWalletFromDB(userId);
  if (!wallet) {
    throw new AppError(404, "Wallet not found", "");
  }

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User Wallet Getting successfully",
    data: wallet,
  });
});

const depositToWallet = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const wallet = await WalletService.depositWalletIntoDB(payload);

  if (!wallet) {
    throw new AppError(404, "Wallet not found", "");
  }

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Deposit successful",
    data: wallet,
  });
});

const withdrawFromWallet = catchAsync(async (req: Request, res: Response) => {
  const { userId, amount } = req.body;

  const wallet = await WalletService.withdrawWalletFromDB(userId);

  if (!wallet) {
    throw new AppError(404, "Wallet not found", "");
  }

  // if (wallet.pin !== pin) {
  //   throw new AppError(401, "Invalid PIN", "");
  // }

  if (wallet.balance < amount) {
    throw new AppError(400, "Insufficient balance", "");
  }

  wallet.balance -= amount;
  await wallet.save();

  res.status(200).json({
    success: true,
    message: "Withdrawal successful",
    data: wallet,
  });
});

export const WalletController = {
  getUserWallet,
  depositToWallet,
  withdrawFromWallet,
};
