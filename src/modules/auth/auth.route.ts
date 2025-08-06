import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { changePassword, loginUser, registerUser } from "./auth.controller";
import { AuthZodSchema } from "./auth.validate";

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
authRouts.post(
  "/changePassword",
  validateRequest(AuthZodSchema.changePasswordZodSchema),
  changePassword
);

export default authRouts;
