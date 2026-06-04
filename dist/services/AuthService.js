"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserRepository_1 = require("../repositories/UserRepository");
const RefreshTokenRepository_1 = require("../repositories/RefreshTokenRepository");
class AuthService {
    async execute({ email, password }) {
        const userRepository = new UserRepository_1.UserRepository();
        const refreshRepository = new RefreshTokenRepository_1.RefreshTokenRepository();
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error("Invalid credentials");
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES
        });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES
        });
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await refreshRepository.create(user.id, refreshToken, expiresAt);
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                created_at: user.created_at
            },
            accessToken,
            refreshToken
        };
    }
}
exports.AuthService = AuthService;
