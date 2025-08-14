"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../error/AppError"));
const inputAmountValidation = (amount) => {
    if (typeof amount === "string")
        amount = Number(amount);
    if (typeof amount !== "number")
        amount = Number(amount);
    if (amount <= 0)
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid deposit amount", "");
};
exports.default = inputAmountValidation;
