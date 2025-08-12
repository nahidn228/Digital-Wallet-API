import { Router } from "express";
import {
  deleteUser,
  getSingleUsers,
  getUserById,
  getUsers,
  updateUser,
} from "./user.controller";
import { UserZodSchema } from "./user.validate";
import { validateRequest } from "../../middleware/validateRequest";
import { auth } from "../../middleware/auth";
import { UserRole } from "./user.constrain";

const userRouts = Router();

userRouts.get("/:email", getSingleUsers);
userRouts.patch("/:email", updateUser);

userRouts.get("/profile/:userId", getUserById);

// userRouts.patch('/:id', updateUserStatus)

userRouts.delete("/:userId", auth([UserRole.Admin]), deleteUser);
userRouts.get("/", getUsers);

export default userRouts;
