"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const SendResponse_1 = require("../../utils/SendResponse");
const http_status_1 = __importDefault(require("http-status"));
const auth_service_1 = require("./auth.service");
const config_1 = __importDefault(require("../../config"));
const registerUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const data = yield auth_service_1.AuthServices.createUserIntoDB(payload);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "User registered successfully",
        data: data,
    });
}));
const loginUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const data = yield auth_service_1.AuthServices.loginUserIntoDB(payload);
    res.cookie("accessToken", data.accessToken, {
        secure: config_1.default.node_env !== "development",
        httpOnly: true,
        sameSite: "lax",
    });
    res.cookie("refreshToken", data.refreshToken, {
        secure: config_1.default.node_env !== "development",
        httpOnly: true,
    });
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User Login successfully",
        data: data,
    });
}));
const refreshToken = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const data = yield auth_service_1.AuthServices.refreshTokenIntoDB(refreshToken);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Token Refresh successfully",
        data: data,
    });
}));
const changePassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const { newPassword, oldPassword } = req.body;
    const data = yield auth_service_1.AuthServices.changePasswordIntoDB(email, newPassword, oldPassword);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password Changed successfully",
        data: data,
    });
}));
const resetpassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phone, password } = req.body;
    const data = yield auth_service_1.AuthServices.resetPasswordIntoDB(email, phone, password);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password Reset successfully",
        data: data,
    });
}));
const logout = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User Logged out successfully",
        data: null,
    });
}));
exports.authController = {
    registerUser,
    loginUser,
    changePassword,
    resetpassword,
    refreshToken,
    logout,
};
