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
exports.TransactionController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const SendResponse_1 = require("../../utils/SendResponse");
const transaction_service_1 = require("./transaction.service");
const deposit = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderEmail, receiverEmail, amount } = req.body;
    const transaction = yield transaction_service_1.TransactionServices.depositIntoDB(senderEmail, receiverEmail, amount);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Deposit successful",
        data: transaction,
    });
}));
const withdraw = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderEmail, receiverEmail, amount } = req.body;
    const transaction = yield transaction_service_1.TransactionServices.withdrawFromDB(senderEmail, receiverEmail, amount);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Withdraw successful",
        data: transaction,
    });
}));
const sendMoney = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderEmail, receiverEmail, amount } = req.body;
    const transaction = yield transaction_service_1.TransactionServices.sendMoneyFromDB(senderEmail, receiverEmail, amount);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Money sent successfully",
        data: transaction,
    });
}));
// const getTransactionHistory = catchAsync(
//   async (req: Request, res: Response) => {
//     const { walletEmail } = req.params;
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;
//     const filters: IFilters = {
//       type: req.query.type as string,
//     };
//     let searchFilter = {};
//     if (req.query.search) {
//       const searchText = req.query.search.toString();
//       searchFilter = {
//         $or: [
//           { transactionId: { $regex: searchText, $options: "i" } },
//           { type: { $regex: searchText, $options: "i" } },
//           { status: { $regex: searchText, $options: "i" } },
//           { senderEmail: { $regex: searchText, $options: "i" } },
//           { receiverEmail: { $regex: searchText, $options: "i" } },
//         ],
//       };
//     }
//     const transactionHistory =
//       await TransactionServices.getTransactionHistoryFromDB(
//         walletEmail,
//         page,
//         limit,
//         { ...filters, ...searchFilter }
//       );
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Transaction history retrieved",
//       data: transactionHistory,
//     });
//   }
// );
const getTransactionHistory = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletEmail } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const filters = {
        type: req.query.type,
        status: req.query.status,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
    };
    let searchFilter = {};
    if (req.query.search) {
        const searchText = req.query.search.toString();
        searchFilter = {
            $or: [
                { transactionId: { $regex: searchText, $options: "i" } },
                { type: { $regex: searchText, $options: "i" } },
                { status: { $regex: searchText, $options: "i" } },
                { senderEmail: { $regex: searchText, $options: "i" } },
                { receiverEmail: { $regex: searchText, $options: "i" } },
            ],
        };
    }
    const transactionHistory = yield transaction_service_1.TransactionServices.getTransactionHistoryFromDB(walletEmail, page, limit, filters, searchFilter);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Transaction history retrieved",
        data: transactionHistory,
    });
}));
const changeTransactionStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    const transaction = yield transaction_service_1.TransactionServices.changeTransactionStatusIntoDB(id, status);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Transaction status updated",
        data: transaction,
    });
}));
const getAllTransaction = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const filters = {
        type: req.query.type,
        status: req.query.status,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
    };
    const transactions = yield transaction_service_1.TransactionServices.getTransactionFromDB(page, limit, filters);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All Transaction Retrieved successfully",
        data: transactions,
    });
}));
exports.TransactionController = {
    deposit,
    withdraw,
    sendMoney,
    getTransactionHistory,
    changeTransactionStatus,
    getAllTransaction,
};
// const transactionHistory = catchAsync(async (req: Request, res: Response) => {
//   const { walletId } = req.params;
//   const transactions = await Transaction.find({
//     $or: [{ senderWalletId: walletId }, { receiverWalletId: walletId }],
//   }).sort({ createdAt: -1 });
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Transaction history retrieved",
//     data: transactions,
//   });
// });
