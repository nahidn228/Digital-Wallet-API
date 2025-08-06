import { Router } from "express";
import {
  deleteUser,
  getSingleUsers,
  getUsers,
  
  updateUser,
} from "./user.controller";
import { UserZodSchema } from "./user.validate";
import { validateRequest } from "../../middleware/validateRequest";
import { auth } from "../../middleware/auth";
import { UserRole } from "./user.constrain";

const userRouts = Router();

// userRouts.post(
//   "/register",
//   validateRequest(UserZodSchema.createUserZodSchema),
//   registerUser
// );
// userRouts.post(
//   "/login",
  
//   validateRequest(UserZodSchema.loginUserZodSchema),
//   loginUser
// );

userRouts.get("/:email", getSingleUsers);
userRouts.patch("/:email", updateUser);
userRouts.delete("/:userId", deleteUser);
userRouts.get("/", auth([UserRole.User]), getUsers);

export default userRouts;
