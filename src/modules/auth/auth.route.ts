import { auth } from "./../../middleware/auth";
import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import {
  changePassword,
  loginUser,
  refreshToken,
  registerUser,
  resetpassword,
} from "./auth.controller";
import { AuthZodSchema } from "./auth.validate";
import { UserRole } from "../user/user.constrain";

const authRouts = Router();

authRouts.post(
  "/register",
  validateRequest(AuthZodSchema.createUserZodSchema),
  registerUser
);

authRouts.post(
  "/login",
  validateRequest(AuthZodSchema.loginUserZodSchema),
  loginUser
);

authRouts.post("/refreshToken", refreshToken);

authRouts.post(
  "/changePassword",
  auth(Object.values(UserRole)),
  validateRequest(AuthZodSchema.changePasswordZodSchema),
  changePassword
);

authRouts.post("/resetPassword", auth(Object.values(UserRole)), resetpassword);

export default authRouts;
