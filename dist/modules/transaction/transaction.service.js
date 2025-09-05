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
exports.TransactionServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const generateReference_1 = require("../../utils/generateReference");
const wallet_model_1 = __importDefault(require("../wallet/wallet.model"));
const transaction_constrain_1 = require("./transaction.constrain");
const transaction_model_1 = __importDefault(require("./transaction.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../user/user.model"));
const user_constrain_1 = require("../user/user.constrain");
const depositIntoDB = (senderEmail, receiverEmail, amount) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof amount !== "number")
        amount = Number(amount);
    if (amount <= 0)
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid deposit amount", "");
    const senderWallet = yield wallet_model_1.default.findOne({ email: senderEmail });
    const receiverWallet = yield wallet_model_1.default.findOne({ email: receiverEmail });
    if (!senderWallet || !receiverWallet) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Sender or receiver wallet not found", "");
    }
    if (senderWallet.balance < amount) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Insufficient balance", "");
    }
    // Update balances
    const senderBefore = senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance;
    const receiverBefore = receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet.balance;
    senderWallet.balance -= amount;
    receiverWallet.balance += amount;
    yield senderWallet.save();
    yield receiverWallet.save();
    // Create sender transaction
    const senderTransaction = yield transaction_model_1.default.create({
        transactionId: (0, generateReference_1.generateTransactionReference)(),
        type: transaction_constrain_1.TransactionType.DEPOSIT,
        amount,
        fee: 0,
        totalAmount: amount,
        status: transaction_constrain_1.TransactionStatus.COMPLETED,
        senderEmail,
        senderWalletId: senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet._id,
        receiverEmail,
        receiverWalletId: receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet._id,
        senderBalanceBefore: senderBefore,
        senderBalanceAfter: senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance,
        receiverBalanceBefore: receiverBefore,
        receiverBalanceAfter: receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet.balance,
    });
    // Create receiver transaction
    const receiverTransaction = yield transaction_model_1.default.create({
        transactionId: (0, generateReference_1.generateTransactionReference)(),
        type: transaction_constrain_1.TransactionType.CASH_IN,
        amount,
        fee: 0,
        totalAmount: amount,
        status: transaction_constrain_1.TransactionStatus.COMPLETED,
        senderEmail,
        senderWalletId: senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet._id,
        receiverEmail,
        receiverWalletId: receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet._id,
        senderBalanceBefore: senderBefore,
        senderBalanceAfter: senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance,
        receiverBalanceBefore: receiverBefore,
        receiverBalanceAfter: receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet.balance,
    });
    return senderTransaction;
});
const withdrawFromDB = (senderEmail, receiverEmail, amount) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof amount !== "number")
        amount = Number(amount);
    if (amount <= 0)
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid deposit amount", "");
    const senderWallet = yield wallet_model_1.default.findOne({ email: senderEmail });
    const receiverWallet = yield wallet_model_1.default.findOne({ email: receiverEmail });
    const receiverInfo = yield user_model_1.default.findOne({ email: receiverEmail });
    if ((receiverInfo === null || receiverInfo === void 0 ? void 0 : receiverInfo.role) !== user_constrain_1.UserRole.Agent) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "You Have to Select an Agent Account for Withdraw", "");
    }
    if (!senderWallet || !receiverWallet) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Sender or receiver wallet not found", "");
    }
    if (senderWallet.balance < amount) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Insufficient balance", "");
    }
    // Update balances
    const senderBefore = senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance;
    const receiverBefore = receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet.balance;
    senderWallet.balance -= amount;
    receiverWallet.balance += amount;
    yield senderWallet.save();
    yield receiverWallet.save();
    // Create sender transaction
    const senderTransaction = yield transaction_model_1.default.create({
        transactionId: (0, generateReference_1.generateTransactionReference)(),
        type: transaction_constrain_1.TransactionType.DEPOSIT,
        amount,
        fee: 0,
        totalAmount: amount,
        status: transaction_constrain_1.TransactionStatus.COMPLETED,
        senderEmail,
        senderWalletId: senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet._id,
        receiverEmail,
        receiverWalletId: receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet._id,
        senderBalanceBefore: senderBefore,
        senderBalanceAfter: senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance,
        receiverBalanceBefore: receiverBefore,
        receiverBalanceAfter: receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet.balance,
    });
    // Create receiver transaction
    const receiverTransaction = yield transaction_model_1.default.create({
        transactionId: (0, generateReference_1.generateTransactionReference)(),
        type: transaction_constrain_1.TransactionType.CASH_IN,
        amount,
        fee: 0,
        totalAmount: amount,
        status: transaction_constrain_1.TransactionStatus.COMPLETED,
        senderEmail,
        senderWalletId: senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet._id,
        receiverEmail,
        receiverWalletId: receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet._id,
        senderBalanceBefore: senderBefore,
        senderBalanceAfter: senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance,
        receiverBalanceBefore: receiverBefore,
        receiverBalanceAfter: receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet.balance,
    });
    return senderTransaction;
});
const sendMoneyFromDB = (senderEmail, receiverEmail, amount) => __awaiter(void 0, void 0, void 0, function* () {
    if (senderEmail === receiverEmail) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Cannot send money to yourself", "");
    }
    if (typeof amount !== "number")
        amount = Number(amount);
    if (amount <= 0)
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid deposit amount", "");
    //  const wallet = await Wallet.findById(userId);
    // const wallet = await Wallet.findOne({ email });
    const senderWallet = yield wallet_model_1.default.findOne({ email: senderEmail });
    const receiverWallet = yield wallet_model_1.default.findOne({ email: receiverEmail });
    if (!senderWallet || !receiverWallet) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Sender or receiver wallet not found", "");
    }
    if (senderWallet.balance < amount) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Insufficient balance", "");
    }
    // Update balances
    const senderBefore = senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance;
    const receiverBefore = receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet.balance;
    senderWallet.balance -= amount;
    receiverWallet.balance += amount;
    yield senderWallet.save();
    yield receiverWallet.save();
    // Create sender transaction
    const senderTransaction = yield transaction_model_1.default.create({
        transactionId: (0, generateReference_1.generateTransactionReference)(),
        type: transaction_constrain_1.TransactionType.SEND_MONEY,
        amount,
        fee: 0,
        totalAmount: amount,
        status: transaction_constrain_1.TransactionStatus.COMPLETED,
        senderEmail,
        senderWalletId: senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet._id,
        receiverEmail,
        receiverWalletId: receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet._id,
        senderBalanceBefore: senderBefore,
        senderBalanceAfter: senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance,
        receiverBalanceBefore: receiverBefore,
        receiverBalanceAfter: receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet.balance,
    });
    // Create receiver transaction
    const receiverTransaction = yield transaction_model_1.default.create({
        transactionId: (0, generateReference_1.generateTransactionReference)(),
        type: transaction_constrain_1.TransactionType.CASH_IN,
        amount,
        fee: 0,
        totalAmount: amount,
        status: transaction_constrain_1.TransactionStatus.COMPLETED,
        senderEmail,
        senderWalletId: senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet._id,
        receiverEmail,
        receiverWalletId: receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet._id,
        senderBalanceBefore: senderBefore,
        senderBalanceAfter: senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance,
        receiverBalanceBefore: receiverBefore,
        receiverBalanceAfter: receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet.balance,
    });
    return { senderTransaction, receiverTransaction };
});
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
const getTransactionHistoryFromDB = (walletEmail_1, page_1, limit_1, filters_1, ...args_1) => __awaiter(void 0, [walletEmail_1, page_1, limit_1, filters_1, ...args_1], void 0, function* (walletEmail, page, limit, filters, searchFilter = {}) {
    const skip = (page - 1) * limit;
    // Base condition: Only user's transactions
    const query = Object.assign({ $or: [{ senderEmail: walletEmail }, { receiverEmail: walletEmail }] }, searchFilter);
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
    const [transactions, total] = yield Promise.all([
        transaction_model_1.default.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        transaction_model_1.default.countDocuments(query),
    ]);
    return { transactions, total, page, limit };
});
const changeTransactionStatusIntoDB = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const transaction = yield transaction_model_1.default.findById(id).session(session);
        if (!transaction)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Transaction not found", "");
        if (transaction.status === status) {
            return transaction;
        }
        transaction.status = status;
        const senderWallet = yield wallet_model_1.default.findById(transaction.senderWalletId).session(session);
        const receiverWallet = yield wallet_model_1.default.findById(transaction.receiverWalletId).session(session);
        if (!senderWallet || !receiverWallet)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Wallet not found", "");
        const debitStatuses = ["Pending", "Failed", "Cancelled"];
        if (debitStatuses.includes(status)) {
            receiverWallet.balance -= transaction.amount;
            senderWallet.balance += transaction.amount;
            transaction.senderBalanceAfter += transaction.amount;
            transaction.receiverBalanceAfter -= transaction.amount;
        }
        else if (status === "Completed") {
            senderWallet.balance -= transaction.amount;
            receiverWallet.balance += transaction.amount;
            transaction.senderBalanceAfter -= transaction.amount;
            transaction.receiverBalanceAfter += transaction.amount;
        }
        else if (status === transaction_constrain_1.TransactionStatus.REVERSED) {
            if (transaction.type === "Deposit") {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This transactions can be reversed", "");
            }
            // Deduct amount from wallet
            receiverWallet.balance -= transaction.amount;
            senderWallet.balance += transaction.amount;
            transaction.senderBalanceAfter += transaction.amount;
            transaction.receiverBalanceAfter -= transaction.amount;
            transaction.status = status;
            // Create reversal audit record
            yield transaction_model_1.default.create([
                {
                    transactionId: (0, generateReference_1.generateTransactionReference)(),
                    type: transaction_constrain_1.TransactionType.REFUND,
                    amount: transaction.amount,
                    fee: 0,
                    totalAmount: transaction.amount,
                    status: transaction_constrain_1.TransactionStatus.COMPLETED,
                    originalTransactionId: transaction._id,
                    senderEmail: transaction.senderEmail,
                    senderWalletId: transaction.senderWalletId,
                    senderBalanceBefore: senderWallet.balance + transaction.amount, // Before deduction
                    senderBalanceAfter: senderWallet.balance, // After deduction
                },
            ], { session });
        }
        yield senderWallet.save({ session });
        yield receiverWallet.save({ session });
        yield transaction.save({ session });
        yield session.commitTransaction();
        return transaction;
    }
    catch (error) {
        yield session.abortTransaction();
        throw new AppError_1.default(http_status_1.default.BAD_GATEWAY, `${error.message}`, "");
    }
    finally {
        session.endSession();
    }
});
const getTransactionFromDB = (page, limit, filters) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * limit;
    const query = {};
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
    const [transactions, total] = yield Promise.all([
        transaction_model_1.default.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        transaction_model_1.default.countDocuments(query),
    ]);
    return { transactions, total, page, limit };
});
exports.TransactionServices = {
    depositIntoDB,
    withdrawFromDB,
    sendMoneyFromDB,
    getTransactionHistoryFromDB,
    changeTransactionStatusIntoDB,
    getTransactionFromDB,
};
