"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const updateUserSchema = zod_1.default.object({
    name: zod_1.default.string().min(3).max(255).optional(),
    email: zod_1.default.email().optional(),
    phone: zod_1.default.string().optional(),
    password: zod_1.default.string().optional(),
    role: zod_1.default.enum(["User", "Admin", "Agent"]).optional(),
    profilePicture: zod_1.default.string().optional(),
    nid: zod_1.default.string().optional(),
    address: zod_1.default.string().optional(),
    dateOfBirth: zod_1.default.string().optional(),
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
