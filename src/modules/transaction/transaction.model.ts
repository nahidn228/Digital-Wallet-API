import { model, Schema } from "mongoose";
import { ITransaction } from "./transaction.interface";
import { TransactionStatus, TransactionType } from "./transaction.constrain";

const transactionSchema = new Schema<ITransaction>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
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
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
    description: {
      type: String,
    },
    reference: {
      type: String,
    },

    // Sender
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderWalletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },

    // Receiver (optional)
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiverWalletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
    },

    // Agent info
    agentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    commission: {
      type: Number,
      default: 0,
    },

    // Balance snapshots
    senderBalanceBefore: Number,
    senderBalanceAfter: Number,
    receiverBalanceBefore: Number,
    receiverBalanceAfter: Number,
  },
  { timestamps: true, versionKey: false }
);

const Transaction = model<ITransaction>("Transaction", transactionSchema);

export default Transaction;
