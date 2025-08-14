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
exports.AuthServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../../config"));
const user_model_1 = __importDefault(require("../user/user.model"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const wallet_model_1 = __importDefault(require("../wallet/wallet.model"));
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.password = yield bcryptjs_1.default.hash(payload.password, Number(config_1.default.BCRYPT_SALT_ROUND));
    const data = yield user_model_1.default.create(payload);
    const wallet = yield wallet_model_1.default.create({
        userId: data === null || data === void 0 ? void 0 : data._id,
        email: data === null || data === void 0 ? void 0 : data.email,
        balance: 50,
        status: "Active",
    });
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
        expiresIn: config_1.default.JWT_ACCESS_EXPIRES,
    });
    const refreshToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.JWT_REFRESH_SECRET, {
        expiresIn: config_1.default.JWT_REFRESH_EXPIRES,
    });
    return { accessToken, refreshToken };
});
const changePasswordIntoDB = (email, newPassword, oldPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.default.findOne({ email });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User Not Found", "");
    }
    const storedPassword = isUserExist.password;
    const isPasswordMatched = yield bcryptjs_1.default.compare(oldPassword, storedPassword);
    if (!isPasswordMatched) {
        throw new AppError_1.default(Number(http_status_1.default[403]), "Password Not Matched", "");
    }
    isUserExist.password = yield bcryptjs_1.default.hash(newPassword, Number(config_1.default.BCRYPT_SALT_ROUND));
    //save password
    yield isUserExist.save();
    const _a = isUserExist.toObject(), { password } = _a, rest = __rest(_a, ["password"]);
    return rest;
});
const resetPasswordIntoDB = (email, phone, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.default.findOne({ email });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User Not Found", "");
    }
    const checkPhoneNumber = isUserExist.phone === phone;
    if (!checkPhoneNumber) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Wrong Phone Number", "");
    }
    isUserExist.password = yield bcryptjs_1.default.hash(newPassword, Number(config_1.default.BCRYPT_SALT_ROUND));
    //save password
    yield isUserExist.save();
    const _a = isUserExist.toObject(), { password } = _a, rest = __rest(_a, ["password"]);
    return rest;
});
const refreshTokenIntoDB = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyRefreshToken = jsonwebtoken_1.default.verify(refreshToken, config_1.default.JWT_REFRESH_SECRET);
    const isUserExist = yield user_model_1.default.findOne({ email: verifyRefreshToken.email });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "User Not Found", "");
    }
    const jwtPayload = {
        email: isUserExist.email,
        role: isUserExist.role,
    };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.JWT_ACCESS_SECRET, {
        expiresIn: config_1.default.JWT_ACCESS_EXPIRES,
    });
    return { accessToken };
});
exports.AuthServices = {
    createUserIntoDB,
    loginUserIntoDB,
    changePasswordIntoDB,
    resetPasswordIntoDB,
    refreshTokenIntoDB,
};
