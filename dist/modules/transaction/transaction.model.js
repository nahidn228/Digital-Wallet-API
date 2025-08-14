"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const transaction_constrain_1 = require("./transaction.constrain");
const transactionSchema = new mongoose_1.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: Object.values(transaction_constrain_1.TransactionType),
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    fee: {
        type: Number,
        default: 0,
        min: 0,
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: Object.values(transaction_constrain_1.TransactionStatus),
        default: transaction_constrain_1.TransactionStatus.PENDING,
    },
    description: {
        type: String,
    },
    reference: {
        type: String,
    },
    // Sender
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    senderWalletId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wallet",
        required: true,
    },
    // Receiver (optional)
    receiverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    receiverWalletId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wallet",
    },
    // Agent info
    agentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    commission: {
        type: Number,
        default: 0,
    },
    originalTransactionId: {
        type: String,
    },
    // Balance snapshots
    senderBalanceBefore: Number,
    senderBalanceAfter: Number,
    receiverBalanceBefore: Number,
    receiverBalanceAfter: Number,
}, { timestamps: true, versionKey: false });
const Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
exports.default = Transaction;
