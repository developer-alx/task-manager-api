"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const AppError_1 = require("../shared/errors/AppError");
class DeleteUserService {
    async execute({ id }) {
        const userRepository = new UserRepository_1.UserRepository();
        const user = await userRepository.findById(id);
        if (!user) {
            throw new AppError_1.AppError("User not found", 404);
        }
        const deleted = await userRepository.delete(id);
        return deleted;
    }
}
exports.DeleteUserService = DeleteUserService;
