"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserByIdService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const AppError_1 = require("../shared/errors/AppError");
class GetUserByIdService {
    async execute({ id }) {
        const userRepository = new UserRepository_1.UserRepository();
        const user = await userRepository.findById(id);
        if (!user) {
            throw new AppError_1.AppError("User not found", 404);
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
    }
}
exports.GetUserByIdService = GetUserByIdService;
