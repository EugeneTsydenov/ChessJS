import jwt from 'jsonwebtoken';
import {prismaClient} from "../prisma-client";
import {randomUUID} from "node:crypto";


class TokenService {
  private async generateTokens(userID: bigint) {
    const accessJti = randomUUID();
    const refreshJti = randomUUID();

    const accessToken = jwt.sign(
      {userID: Number(userID)},
      process.env.JWT_ACCESS_SECRET!,
      {expiresIn: '15m', jwtid: accessJti}
    )
    const refreshToken = jwt.sign(
      {userID: Number(userID)},
      process.env.JWT_REFRESH_SECRET!,
      {expiresIn: '30d', jwtid: refreshJti}
    )

    return {
      accessToken,
      refreshToken,
      accessJti,
      refreshJti
    }
  }

  public async addTokens(userId: bigint) {
    try {
      await prismaClient.token.deleteMany({
        where: {
          user_id: userId,
        },
      });

      const { accessToken, refreshToken, accessJti,refreshJti } =
        await this.generateTokens(userId);

      const refreshTokenDb = await prismaClient.token.create({
        data: {
          token_type: 2,
          user_id: userId,
          is_revoked: false,
          jti: refreshJti
        },
      });

      const accessTokenDb = await prismaClient.token.create({
        data: {
          token_type: 1,
          user_id: userId,
          is_revoked: false,
          jti: accessJti
        },
      });

      return {
        refreshToken: refreshToken,
        accessToken: accessToken,
      };
    } catch (e) {
      throw e;
    }
  }
  
  public async parseToken(token: string) {
    return jwt.decode(token)
  }

  public async validateAccessToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET!)
    } catch (e) {
      throw e;
    }
  }

  public async validateRefreshToken(token: string){
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
      if(!decodedToken) {
        throw new Error('error')
      }
      return decodedToken
    } catch (e) {
      throw e;
    }
  }


  public async deleteTokenByJti(jti: string) {
    try {
      await prismaClient.token.deleteMany({
        where: {
          jti: jti
        }
      })
    } catch (e) {
      throw e;
    }
  }

  public async findTokenByJti(jti:string) {
    try {
      return await prismaClient.token.findFirst({
        where: {
          jti: jti
        }
      });
    } catch (e) {
      throw e
    }
  }
}

export default new TokenService();