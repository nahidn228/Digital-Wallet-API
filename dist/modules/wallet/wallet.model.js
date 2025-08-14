"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const walletSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, default: 0 },
    email: { type: String, required: true },
    status: {
        type: String,
        enum: {
            values: ["Active", "Blocked", "Suspended"],
            message: "{VALUE} is not acceptable",
        },
        required: true,
    },
    pin: { type: String, select: false },
}, { timestamps: true, versionKey: false });
const Wallet = (0, mongoose_1.model)("Wallet", walletSchema);
exports.default = Wallet;
