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
  senderId: string | IUser;
  senderWalletId: string | IWallet;

  // Receiver information (optional - for transfers)
  receiverId?: string | IUser;
  receiverWalletId?: string | IWallet;

  // Agent information (for cash-in/cash-out)
  agentId?: string | IUser;
  commission?: number;

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
}
