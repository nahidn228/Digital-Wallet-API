"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_constrain_1 = require("../user/user.constrain");
const createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .min(3, "Name must be minimum 3 character")
        .max(255, "Name must be maximum 255 character"),
    email: zod_1.default.email({ error: "please enter a valid email" }),
    phone: zod_1.default.string(),
    password: zod_1.default.string(),
    role: zod_1.default.enum(user_constrain_1.UserRole),
    profilePicture: zod_1.default
        .string()
        .url("Profile picture must be a valid URL")
        .optional()
        .or(zod_1.default.literal("")),
    nid: zod_1.default
        .string()
        .min(10, "NID must be at least 10 characters")
        .max(20, "NID must be maximum 20 characters")
        .regex(/^[0-9]+$/, "NID must contain only numbers")
        .optional(),
    address: zod_1.default
        .string()
        .min(10, "Address must be at least 10 characters")
        .max(500, "Address must be maximum 500 characters")
        .optional(),
    dateOfBirth: zod_1.default
        .string()
        .datetime("Please provide a valid date")
        .or(zod_1.default.date())
        .transform((date) => new Date(date))
        .refine((date) => {
        const age = new Date().getFullYear() - date.getFullYear();
        return age >= 18 && age <= 100;
    }, "User must be between 18 and 100 years old")
        .optional(),
    isVerified: zod_1.default.boolean().default(false),
    isActive: zod_1.default.boolean().default(true),
});
const loginUserZodSchema = zod_1.default.object({
    email: zod_1.default.email({ error: "please enter a valid email" }),
    password: zod_1.default.string(),
});
const changePasswordZodSchema = zod_1.default.object({
    oldPassword: zod_1.default.string(),
    newPassword: zod_1.default.string(),
});
exports.AuthZodSchema = {
    createUserZodSchema,
    loginUserZodSchema,
    changePasswordZodSchema,
};
