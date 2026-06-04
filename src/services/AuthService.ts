import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/UserRepository";
import { RefreshTokenRepository } from "../repositories/RefreshTokenRepository";

interface LoginDTO {
  email: string;
  password: string;
}

export class AuthService {

  async execute({ email, password }: LoginDTO) {

    const userRepository = new UserRepository();
    const refreshRepository = new RefreshTokenRepository();

    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES as jwt.SignOptions["expiresIn"]
      }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_REFRESH_SECRET as string,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES as jwt.SignOptions["expiresIn"]
      }
    );

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