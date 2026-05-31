"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const AppError_1 = require("./AppError");
const logger_1 = __importDefault(require("../logger"));
function errorHandler(err, request, response, next) {
    if (err instanceof AppError_1.AppError) {
        logger_1.default.warn(err.message);
        return response.status(err.statusCode).json({
            message: err.message
        });
    }
    logger_1.default.error(err);
    return response.status(500).json({
        message: "Internal server error"
    });
}
