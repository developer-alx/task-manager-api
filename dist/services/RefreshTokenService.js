"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const RefreshTokenRepository_1 = require("../repositories/RefreshTokenRepository");
class RefreshTokenService {
    async execute(token) {
        const refreshRepository = new RefreshTokenRepository_1.RefreshTokenRepository();
        const storedToken = await refreshRepository.findByToken(token);
        if (!storedToken) {
            throw new Error("Invalid refresh token");
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
        const newAccessToken = jsonwebtoken_1.default.sign({ userId: decoded.userId }, process.env.JWT_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES
        });
        return {
            accessToken: newAccessToken
        };
    }
}
exports.RefreshTokenService = RefreshTokenService;
