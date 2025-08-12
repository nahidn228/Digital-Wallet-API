export enum TransactionType {
  DEPOSIT = "Deposit",
  WITHDRAW = "Withdraw",
  SEND_MONEY = "Send_money",
  CASH_IN = "Cash_in",
  CASH_OUT = "Cash_out",
  REFUND = 'Refund'
}

export enum TransactionStatus {
  PENDING = "Pending",
  COMPLETED = "Completed",
  FAILED = "Failed",
  CANCELLED = "Cancelled",
  REVERSED = "Reversed",
}
