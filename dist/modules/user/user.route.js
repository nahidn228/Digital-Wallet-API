"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_1 = require("../../middleware/auth");
const user_constrain_1 = require("./user.constrain");
const userRouts = (0, express_1.Router)();
userRouts.get("/me", (0, auth_1.auth)(Object.values(user_constrain_1.UserRole)), user_controller_1.getSingleUsers);
userRouts.patch("/:email", (0, auth_1.auth)(Object.values(user_constrain_1.UserRole)), 
// validateRequest(UserZodSchema.updateUserSchema),
user_controller_1.updateUser);
userRouts.get("/profile/:userId", (0, auth_1.auth)([user_constrain_1.UserRole.Admin]), user_controller_1.getUserById);
userRouts.put("/status/:userId", 
// validateRequest(UserZodSchema.updateUserSchema),
(0, auth_1.auth)([user_constrain_1.UserRole.Admin]), user_controller_1.updateUserStatus);
userRouts.delete("/:userId", (0, auth_1.auth)([user_constrain_1.UserRole.Admin]), user_controller_1.deleteUser);
userRouts.get("/", (0, auth_1.auth)([user_constrain_1.UserRole.Admin]), user_controller_1.getUsers);
exports.default = userRouts;
