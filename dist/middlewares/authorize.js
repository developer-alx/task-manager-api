"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = authorize;
exports.ensureOwnerOrRole = ensureOwnerOrRole;
const AppError_1 = require("../shared/errors/AppError");
function authorize(...roles) {
    return (req, res, next) => {
        if (!req.userId) {
            throw new AppError_1.AppError("Permission denied", 403);
        }
        const role = req.userRole;
        if (!role) {
            throw new AppError_1.AppError("Permission denied", 403);
        }
        if (!roles.includes(role)) {
            throw new AppError_1.AppError("Permission denied", 403);
        }
        return next();
    };
}
function ensureOwnerOrRole(requiredRole) {
    return (req, res, next) => {
        if (!req.userId) {
            throw new AppError_1.AppError("Permission denied", 403);
        }
        const userId = Number(req.userId);
        const targetId = Number(req.params.id);
        if (Number.isNaN(targetId)) {
            throw new AppError_1.AppError("Permission denied", 403);
        }
        if (req.userRole === requiredRole || userId === targetId) {
            return next();
        }
        throw new AppError_1.AppError("Permission denied", 403);
    };
}
