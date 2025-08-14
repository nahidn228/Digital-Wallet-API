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
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
// const createUserIntoDB = async (payload: IUser) => {
//   payload.password = await bcrypt.hash(
//     payload.password,
//     Number(config.BCRYPT_SALT_ROUND)
//   );
//   const data = await User.create(payload);
//   return data;
// };
// const loginUserIntoDB = async (payload: IUser) => {
//   const isUserExist = await User.findOne({ email: payload.email });
//   if (!isUserExist) {
//     throw new AppError(status.UNAUTHORIZED, "User Not Found", ""); //status_code, message, stack
//   }
//   const checkPassword = await bcrypt.compare(
//     payload.password,
//     isUserExist.password
//   );
//   if (!checkPassword) {
//     throw new AppError(
//       status.BAD_REQUEST,
//       "Email and password are not Matched",
//       ""
//     );
//   }
//   const jwtPayload = {
//     email: payload.email,
//     role: isUserExist.role,
//   };
//   const accessToken = jwt.sign(jwtPayload, config.JWT_ACCESS_SECRET as string, {
//     expiresIn: "7d",
//   });
//   return accessToken;
// };
const getUserFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield user_model_1.default.find();
    return data;
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
};
