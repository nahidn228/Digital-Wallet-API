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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = exports.updateUserStatus = exports.getUserById = exports.deleteUser = exports.updateUser = exports.getSingleUsers = exports.getUsers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_service_1 = require("./user.service");
const catchAsync_1 = require("../../utils/catchAsync");
const SendResponse_1 = require("../../utils/SendResponse");
const AppError_1 = __importDefault(require("../../error/AppError"));
const registerUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const data = yield user_service_1.UserServices.createUserIntoDB(payload);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "User registered successfully",
        data: data,
    });
}));
exports.registerUser = registerUser;
const loginUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const data = yield user_service_1.UserServices.loginUserIntoDB(payload);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User Login successfully",
        data: data,
    });
}));
exports.loginUser = loginUser;
const getUsers = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract and parse query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // Build filters object
    const filters = {};
    if (req.query.email) {
        filters.email = req.query.email;
    }
    if (req.query.role) {
        filters.role = req.query.role;
    }
    // Get data from DB
    // const {
    //   users,
    //   total,
    //   page: currentPage,
    //   limit: pageSize,
    // } = await UserServices.getUserFromDB(page, limit, filters);
    const users = yield user_service_1.UserServices.getUserFromDB(page, limit, filters);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User retrieved successfully",
        data: users,
    });
}));
exports.getUsers = getUsers;
const getSingleUsers = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ message: "No token found" });
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
    const emailFromToken = decoded.email;
    const user = yield user_service_1.UserServices.getUserByEmailFromDB(emailFromToken);
    if (!user) {
        return res.status(401).json({ message: "No token found" });
    }
    const _a = user.toObject(), { password } = _a, userWithoutPassword = __rest(_a, ["password"]);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User retrieved successfully",
        data: userWithoutPassword,
    });
}));
exports.getSingleUsers = getSingleUsers;
const updateUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.params.email;
    const payload = req.body || {};
    // console.log({ email, payload });
    if (!Object.keys(payload).length) {
        return res.status(400).json({ message: "No data provided for update" });
    }
    // console.log("Received update request for:", email);
    // console.log("Payload received:", payload);
    // console.log("Payload type:", typeof payload);
    // console.log("Payload keys:", Object.keys(payload));
    const data = yield user_service_1.UserServices.updateUserFromDB(email, req.body);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "User Updated successfully",
        data: data,
    });
}));
exports.updateUser = updateUser;
const deleteUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const data = yield user_service_1.UserServices.deleteUserByIdFromDB(userId);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User Deleted successfully",
        data: null,
    });
}));
exports.deleteUser = deleteUser;
const getUserById = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const data = yield user_service_1.UserServices.getUserByIdFromDB(userId);
    if (!data) {
        throw new AppError_1.default(404, "User not found", "");
    }
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User Retrieved successfully",
        data: data,
    });
}));
exports.getUserById = getUserById;
const updateUserStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const payload = req.body;
    const data = yield user_service_1.UserServices.updateUserStatusIntoDB(userId, payload);
    if (!data) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found", "");
    }
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User Status Updated successfully",
        data: data,
    });
}));
exports.updateUserStatus = updateUserStatus;
