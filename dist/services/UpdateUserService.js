"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const AppError_1 = require("../shared/errors/AppError");
class UpdateUserService {
    async execute({ id, data }) {
        const userRepository = new UserRepository_1.UserRepository();
        const user = await userRepository.findById(id);
        if (!user) {
            throw new AppError_1.AppError("User not found", 404);
        }
        const updatedUser = await userRepository.update(id, data);
        return {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            created_at: updatedUser.created_at,
        };
    }
}
exports.UpdateUserService = UpdateUserService;
