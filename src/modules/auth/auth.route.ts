import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { loginUser, registerUser } from "./auth.controller";
import { UserZodSchema } from "./auth.validate";

const authRouts = Router();

authRouts.post(
  "/register",
  validateRequest(UserZodSchema.createUserZodSchema),
  registerUser
);
authRouts.post(
  "/login",
  
  validateRequest(UserZodSchema.loginUserZodSchema),
  loginUser
);


export default authRouts;