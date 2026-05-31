import jwt from "jsonwebtoken";
import { RefreshTokenRepository } from "../repositories/RefreshTokenRepository";

interface TokenPayload {
  userId: number;
}

export class RefreshTokenService {

  async execute(token: string) {

    const refreshRepository = new RefreshTokenRepository();

    const storedToken = await refreshRepository.findByToken(token);

    if (!storedToken) {
      throw new Error("Invalid refresh token");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    ) as TokenPayload;

    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES as jwt.SignOptions["expiresIn"]
      }
    );

    return {
      accessToken: newAccessToken
    };
  }

}