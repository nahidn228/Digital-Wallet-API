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
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = __importDefault(require("../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const user_model_1 = __importDefault(require("../modules/user/user.model"));
const auth = (role) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.accessToken;
    if (!token) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Unauthorized Access", "");
    }
    const isVerifiedToken = jsonwebtoken_1.default.verify(token, config_1.default.JWT_ACCESS_SECRET);
    // console.log(isVerifiedToken);
    const isUserExist = yield user_model_1.default.findOne({ email: isVerifiedToken.email });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "User Not Found", "");
    }
    if (!role.includes(isVerifiedToken.role)) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access", "");
    }
    req.user = isUserExist;
    next();
});
exports.auth = auth;
