import { Router } from "express";
import { getSingleUsers, getUsers, registerUser } from "./user.controller";
import { UserZodSchema } from "./user.validate";
import { validateRequest } from "../../middleware/validateRequest";

const userRouts = Router();

userRouts.post(
  "/",
  validateRequest(UserZodSchema.UserCreateZodSchema),
  registerUser
);
userRouts.get("/:email", getSingleUsers);
userRouts.get("/", getUsers);

export default userRouts;
