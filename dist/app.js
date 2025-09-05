"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./modules/routes"));
const globalErrorHandler_1 = __importDefault(require("./middleware/globalErrorHandler"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "https://digital-wallet-umber.vercel.app",
        "http://localhost:5173",
    ],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api", routes_1.default);
app.get("/", (req, res) => {
    res.send({
        success: true,
        message: "Digital Wallet API is Running",
    });
});
app.use(globalErrorHandler_1.default);
exports.default = app;
