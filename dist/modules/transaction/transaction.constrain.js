"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatus = exports.TransactionType = void 0;
var TransactionType;
(function (TransactionType) {
    TransactionType["DEPOSIT"] = "Deposit";
    TransactionType["WITHDRAW"] = "Withdraw";
    TransactionType["SEND_MONEY"] = "Send_money";
    TransactionType["CASH_IN"] = "Cash_in";
    TransactionType["CASH_OUT"] = "Cash_out";
    TransactionType["REFUND"] = "Refund";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "Pending";
    TransactionStatus["COMPLETED"] = "Completed";
    TransactionStatus["FAILED"] = "Failed";
    TransactionStatus["CANCELLED"] = "Cancelled";
    TransactionStatus["REVERSED"] = "Reversed";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
