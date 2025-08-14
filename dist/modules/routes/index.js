"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = __importDefault(require("../user/user.route"));
const auth_route_1 = __importDefault(require("../auth/auth.route"));
const wallet_route_1 = __importDefault(require("../wallet/wallet.route"));
const transaction_route_1 = __importDefault(require("../transaction/transaction.route"));
const routes = (0, express_1.Router)();
routes.use("/user", user_route_1.default);
routes.use("/auth", auth_route_1.default);
routes.use("/wallet", wallet_route_1.default);
routes.use("/transaction", transaction_route_1.default);
exports.default = routes;
