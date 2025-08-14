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
exports.updateUserStatus = exports.getUserById = exports.deleteUser = exports.updateUser = exports.getSingleUsers = exports.getUsers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const user_service_1 = require("./user.service");
const catchAsync_1 = require("../../utils/catchAsync");
const SendResponse_1 = require("../../utils/SendResponse");
const AppError_1 = __importDefault(require("../../error/AppError"));
// const registerUser = catchAsync(async (req: Request, res: Response) => {
//   const payload = req.body;
//   const data = await UserServices.createUserIntoDB(payload);
//   sendResponse(res, {
//     statusCode: status.CREATED,
//     success: true,
//     message: "User registered successfully",
//     data: data,
//   });
// });
// const loginUser = catchAsync(async (req: Request, res: Response) => {
//   const payload = req.body;
//   const data = await UserServices.loginUserIntoDB(payload);
//   sendResponse(res, {
//     statusCode: status.OK,
//     success: true,
//     message: "User Login successfully",
//     data: data,
//   });
// });
const getUsers = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield user_service_1.UserServices.getUserFromDB();
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User retrieved successfully",
        data: data,
    });
}));
exports.getUsers = getUsers;
const getSingleUsers = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.params.email;
    console.log(email);
    const user = yield user_service_1.UserServices.getUserByEmailFromDB(email);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User retrieved successfully",
        data: user,
    });
}));
exports.getSingleUsers = getSingleUsers;
const updateUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.params.email;
    const payload = req.body;
    const data = yield user_service_1.UserServices.updateUserFromDB(email, payload);
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
