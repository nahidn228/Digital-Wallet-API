import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/SendResponse";
import status from "http-status";
import { AuthServices } from "./auth.service";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const data = await AuthServices.createUserIntoDB(payload);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "User registered successfully",
    data: data,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const data = await AuthServices.loginUserIntoDB(payload);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User Login successfully",
    data: data,
  });
});



export {
  registerUser,
  loginUser,

};