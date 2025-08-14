"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const wallet_service_1 = require("./wallet.service");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const SendResponse_1 = require("../../utils/SendResponse");
const getUserWalletById = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const wallet = yield wallet_service_1.WalletService.getSingleWalletByIdFromDB(userId);
    if (!wallet) {
        throw new AppError_1.default(404, "Wallet not found", "");
    }
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User Wallet Getting successfully",
        data: wallet,
    });
}));
const getUserWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.params.email;
    const wallet = yield wallet_service_1.WalletService.getUserWalletFromDB(email);
    if (!wallet) {
        throw new AppError_1.default(404, "Wallet not found", "");
    }
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User Wallet Getting successfully",
        data: wallet,
    });
}));
const depositToWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const wallet = yield wallet_service_1.WalletService.depositWalletIntoDB(payload);
    if (!wallet) {
        throw new AppError_1.default(404, "Wallet not found", "");
    }
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Deposit successful",
        data: wallet,
    });
}));
const withdrawFromWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, amount } = req.body;
    const wallet = yield wallet_service_1.WalletService.withdrawWalletFromDB(userId);
    if (!wallet) {
        throw new AppError_1.default(404, "Wallet not found", "");
    }
    // if (wallet.pin !== pin) {
    //   throw new AppError(401, "Invalid PIN", "");
    // }
    if (wallet.balance < amount) {
        throw new AppError_1.default(400, "Insufficient balance", "");
    }
    wallet.balance -= amount;
    yield wallet.save();
    res.status(200).json({
        success: true,
        message: "Withdrawal successful",
        data: wallet,
    });
}));
const updateWalletStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.params.email;
    const payload = req.body;
    const data = yield wallet_service_1.WalletService.updateWalletFromDB(email, payload);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Wallet Status Updated successfully",
        data: data,
    });
}));
exports.WalletController = {
    getUserWalletById,
    depositToWallet,
    withdrawFromWallet,
    getUserWallet,
    updateWalletStatus,
};
