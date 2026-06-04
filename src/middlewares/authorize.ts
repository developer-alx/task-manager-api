import { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/errors/AppError";

export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId) {
      throw new AppError("Permission denied", 403);
    }

    const role = req.userRole;

    if (!role) {
      throw new AppError("Permission denied", 403);
    }

    if (!roles.includes(role)) {
      throw new AppError("Permission denied", 403);
    }

    return next();
  };
}

export function ensureOwnerOrRole(requiredRole: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId) {
      throw new AppError("Permission denied", 403);
    }

    const userId = Number(req.userId);
    const targetId = Number(req.params.id);

    if (Number.isNaN(targetId)) {
      throw new AppError("Permission denied", 403);
    }

    if (req.userRole === requiredRole || userId === targetId) {
      return next();
    }

    throw new AppError("Permission denied", 403);
  };
}
