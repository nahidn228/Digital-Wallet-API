import status from "http-status";
import AppError from "../error/AppError";

const inputAmountValidation = (amount: number) => {
  if (typeof amount === "string") amount = Number(amount);
  if (typeof amount !== "number") amount = Number(amount);
  if (amount <= 0)
    throw new AppError(status.BAD_REQUEST, "Invalid deposit amount", "");
};

export default inputAmountValidation;
