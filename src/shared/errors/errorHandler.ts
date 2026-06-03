import { Request, Response, NextFunction } from "express"
import { AppError } from "./AppError"
import logger from "../logger"

export function errorHandler(
  err: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {

  if (err instanceof AppError) {
    logger.warn(err.message)
    return response.status(err.statusCode).json({
      message: err.message
    })
  }

  console.error(err);
  // logger.error(err)

  return response.status(500).json({
    message: "Internal server error"
  })
}