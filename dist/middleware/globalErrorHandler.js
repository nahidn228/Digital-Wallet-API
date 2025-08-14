"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Internal Server Error";
    let errorSources = [];
    if (err.code === 11000) {
        const duplicate = err.message.match(/"([^"]*)"/)[1];
        message = `${duplicate} is already exist`;
    }
    else if (err.name === mongoose_1.default.Error.CastError) {
        message = "Invalid MongoDB ObjectID";
    }
    else if (err.name === mongoose_1.default.Error.ValidationError) {
        const errors = Object.values(err.errors);
        errors.forEach((error) => {
            errorSources.push({ path: error.path, message: error.message });
        });
    }
    else if (err instanceof zod_1.ZodError) {
        err.issues.forEach((issue) => {
            errorSources.push({
                path: issue.path[issue.path.length - 1],
                message: issue.message,
            });
        });
    }
    res.status(statusCode).json({
        success: false,
        message: message,
        error: errorSources,
        errorDetails: err,
    });
};
exports.default = globalErrorHandler;
