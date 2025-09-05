import { Router } from "express";
import {
  deleteUser,
  getSingleUsers,
  getUserById,
  getUsers,
  updateUser,
  updateUserStatus,
} from "./user.controller";
import { UserZodSchema } from "./user.validate";
import { validateRequest } from "../../middleware/validateRequest";
import { auth } from "../../middleware/auth";
import { UserRole } from "./user.constrain";

const userRouts = Router();

userRouts.get("/me", auth(Object.values(UserRole)), getSingleUsers);
userRouts.patch(
  "/:email",
  auth(Object.values(UserRole)),
  // validateRequest(UserZodSchema.updateUserSchema),
  updateUser
);

userRouts.get("/profile/:userId", auth([UserRole.Admin]), getUserById);

userRouts.put(
  "/status/:userId",
  // validateRequest(UserZodSchema.updateUserSchema),
  auth([UserRole.Admin]),
  updateUserStatus
);

userRouts.delete("/:userId", auth([UserRole.Admin]), deleteUser);
userRouts.get("/", auth([UserRole.Admin]), getUsers);

export default userRouts;
