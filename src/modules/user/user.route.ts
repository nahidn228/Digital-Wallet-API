import { Router } from "express";
import {
  deleteUser,
  getSingleUsers,
  getUsers,
  registerUser,
  updateUser,
} from "./user.controller";
import { UserZodSchema } from "./user.validate";
import { validateRequest } from "../../middleware/validateRequest";

const userRouts = Router();

userRouts.post(
  "/",
  validateRequest(UserZodSchema.UserCreateZodSchema),
  registerUser
);
userRouts.get("/:email", getSingleUsers);
userRouts.patch("/:email", updateUser);
userRouts.delete("/:userId", deleteUser);
userRouts.get("/", getUsers);

export default userRouts;
