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
exports.UserServices = void 0;
const user_model_1 = __importDefault(require("./user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.password = yield bcryptjs_1.default.hash(payload.password, Number(config_1.default.BCRYPT_SALT_ROUND));
    const data = yield user_model_1.default.create(payload);
    return data;
});
const loginUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.default.findOne({ email: payload.email });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "User Not Found", ""); //status_code, message, stack
    }
    const checkPassword = yield bcryptjs_1.default.compare(payload.password, isUserExist.password);
    if (!checkPassword) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Email and password are not Matched", "");
    }
    const jwtPayload = {
        email: payload.email,
        role: isUserExist.role,
    };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.JWT_ACCESS_SECRET, {
        expiresIn: "7d",
    });
    return accessToken;
});
const getUserFromDB = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    // Base query
    const query = {};
    // Filter by email (partial match)
    if (filters.email) {
        query.email = { $regex: filters.email, $options: "i" };
    }
    // Filter by role
    if (filters.role) {
        query.role = filters.role;
    }
    // Fetch paginated results & total count in parallel
    const [users, total] = yield Promise.all([
        user_model_1.default.find(query)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        user_model_1.default.countDocuments(query),
    ]);
    return { users, total, page, limit };
});
const getUserByEmailFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: payload });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User Doesn't Exist", "");
    }
    return user;
});
const updateUserFromDB = (email, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.email) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You do not have Access For This Operation", "");
    }
    const data = yield user_model_1.default.findOneAndUpdate({ email }, payload, {
        new: true,
        runValidators: true,
    });
    return data;
});
const deleteUserByIdFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield user_model_1.default.findByIdAndDelete(userId);
    return data;
});
const getUserByIdFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // const data = await User.findById(userId);
    const user = yield user_model_1.default.findById(userId).populate({
        path: "wallet",
        select: "balance status -_id", // Only return specific fields
    });
    return user;
});
const updateUserStatusIntoDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // const data = await User.findOneAndUpdate({ _id: userId }, payload, {
    //   new: true,
    //   runValidators: true,
    // });
    console.log(payload);
    const data = yield user_model_1.default.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return data;
});
exports.UserServices = {
    getUserFromDB,
    getUserByEmailFromDB,
    updateUserFromDB,
    deleteUserByIdFromDB,
    getUserByIdFromDB,
    updateUserStatusIntoDB,
    loginUserIntoDB,
    createUserIntoDB,
};
