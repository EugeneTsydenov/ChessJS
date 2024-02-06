import jwt from 'jsonwebtoken';
import {prismaClient} from "../prisma-client";


class TokenService {
  private async generateTokens(userID: string) {
    const accessToken = jwt.sign({userID: userID}, process.env.JWT_ACCESS_SECRET!, {expiresIn: '15m'})
    const refreshToken = jwt.sign({userID: userID}, process.env.JWT_REFRESH_SECRET!, {expiresIn: '30d'})
    return {
      accessToken,
      refreshToken
    }
  }

  public async addToken(userId: string) {
    try {
      await prismaClient.refreshToken.deleteMany({
        where: {
          user_id: userId,
        },
      });

      const { accessToken, refreshToken } = await this.generateTokens(userId);

      const refreshTokenDb = await prismaClient.refreshToken.create({
        data: {
          token: refreshToken,
          user_id: userId
        },
      });

      return {
        refreshToken: refreshTokenDb.token,
        accessToken: accessToken,
      };
    } catch (e) {
      throw e;
    }
  }

  public async validateAccessToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET!)
    } catch (e) {
      console.log(e, 'dsaew')
      throw e;
    }
  }

  public async validateRefreshToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
    } catch (e) {
      return null;
    }
  }

  public async deleteTokenByToken(token: string) {
    try {
      await prismaClient.refreshToken.deleteMany({
        where: {
          token: token
        }
      })
    } catch (e) {
      throw e;
    }
  }

  public async findToken(refreshToken:string) {
    try {
      return await prismaClient.refreshToken.findFirst({
        where: {
          token: refreshToken
        }
      });
    } catch (e) {
      throw e
    }
  }
}

export default new TokenService();