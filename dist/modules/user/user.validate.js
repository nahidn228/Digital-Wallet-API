"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_constrain_1 = require("./user.constrain");
const updateUserSchema = zod_1.default.object({
    //Email can not be modified
    name: zod_1.default.string().min(1).optional(),
    phone: zod_1.default.string().min(11).optional(),
    password: zod_1.default.string().min(6).optional(),
    role: zod_1.default.enum(user_constrain_1.UserRole).optional(),
    isVerified: zod_1.default.boolean().optional(),
    isActive: zod_1.default.boolean().optional(),
});
const getUserByIdSchema = zod_1.default.object({
    userId: zod_1.default.string().min(1, "User ID is required"),
});
exports.UserZodSchema = {
    updateUserSchema,
    getUserByIdSchema,
};
