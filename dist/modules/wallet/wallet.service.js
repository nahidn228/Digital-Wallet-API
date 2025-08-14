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
exports.WalletService = void 0;
const wallet_model_1 = __importDefault(require("./wallet.model"));
const getUserWalletFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.default.findOne({ email });
    return wallet;
});
const getSingleWalletByIdFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.default.findOne({ userId });
    return wallet;
});
const depositWalletIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, amount } = payload;
    const wallet = yield wallet_model_1.default.findOneAndUpdate({ userId }, { $inc: { balance: amount } }, // Increment balance
    { new: true });
    return wallet;
});
const withdrawWalletFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.default.findOne({ userId });
    return wallet;
});
const updateWalletFromDB = (email, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield wallet_model_1.default.findOneAndUpdate({ email }, payload, {
        new: true,
        runValidators: true,
    });
    return data;
});
exports.WalletService = {
    getUserWalletFromDB,
    getSingleWalletByIdFromDB,
    depositWalletIntoDB,
    withdrawWalletFromDB,
    updateWalletFromDB,
};
