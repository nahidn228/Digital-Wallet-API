import { IUser } from "../user/user.interface";
import { WalletStatus } from "../wallet/wallet.constrain";
import { IWallet } from "../wallet/wallet.interface";
import { TransactionStatus, TransactionType } from "./transaction.constrain";

export interface ITransaction {
  transactionId: string;
  type: TransactionType;
  amount: number;
  fee: number;
  totalAmount: number;
  status: TransactionStatus;
  description?: string;
  reference?: string;

  // Sender information
  senderEmail: string | IUser;
  senderWalletId: string | IWallet;

  // Receiver information (optional - for transfers)
  receiverEmail?: string | IUser;
  receiverWalletId?: string | IWallet;

  // Agent information (for cash-in/cash-out)
  agentId?: string | IUser;
  commission?: number;
  originalTransactionId?: string;
  // Balance snapshots
  senderBalanceBefore?: number;
  senderBalanceAfter?: number;
  receiverBalanceBefore?: number;
  receiverBalanceAfter?: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFilters {
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  email?: string;
  createdAt?: string;
  $or?: Record<string, any>[];
}
