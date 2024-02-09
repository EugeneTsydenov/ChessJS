import bcrypt from 'bcrypt';
import {IAuthUser} from "../models/IAuthUser";
import {prismaClient} from "../prisma-client";
import {ApiError} from "../exceptions/api-error";
import TokenService from "./token-service";
import tokenService from "./token-service";
import {UserDto} from "../dtos/user-dto";

class UserService {
  public async registration(user: IAuthUser): Promise<any> {
    try {
      if (!!await this.isUserExist(user.email)) {
        throw ApiError.BadRequest(`A user with the same email: ${user.email} already exists!`)
      }

      const hashPassword = await bcrypt.hash(user.password, 10);

      const userDB = await prismaClient.user.create({
        data: {
          email: user.email,
          username: user.username,
          hash_password: hashPassword,
        }
      })

      return await TokenService.addTokens(userDB.id);
    } catch (e) {
      throw e;
    }
  }

  public async login(user: IAuthUser) {
    try {
      const userDB = await this.isUserExist(user.email);

      if(!userDB) {
        throw ApiError.BadRequest('User not found!')
      }

      const passwordMatch = await bcrypt.compare(user.password, userDB.hash_password);

      if (!passwordMatch) {
        throw ApiError.BadRequest('Incorrect password!');
      }

      await prismaClient.user.findFirst({
        where: {
          id: userDB.id
        }
      })

      return await TokenService.addTokens(userDB.id);
    } catch (e) {
        console.log(e)
      throw e;
    }
  }

  public async refresh(refreshToken:string) {
    try {
      if(!refreshToken) {
        throw ApiError.UnauthorizedError();
      }
      const decodedToken = await tokenService.validateRefreshToken(refreshToken);


      if(typeof decodedToken === 'object') {
        const jti = decodedToken?.jti;
        const tokenFromDB = jti && await tokenService.findTokenByJti(jti);
        if(!tokenFromDB) {
          throw ApiError.UnauthorizedError()
        }

        if(Number(tokenFromDB.user_id) !== decodedToken.userID) {
          throw ApiError.UnauthorizedError()
        }

        return await tokenService.addTokens(tokenFromDB.user_id)
      }
    } catch (e) {
      throw e
    }
  }

  public async getUser(refreshToken: string) {
    try {
      const decodedToken = await tokenService.validateRefreshToken(refreshToken);

      if(typeof decodedToken === 'object') {
        const userId = decodedToken.userID;

        if(!userId) {
          throw ApiError.UnauthorizedError()
        }

        const user = await this.findById(userId);

        if(!user) {
          throw ApiError.UnauthorizedError()
        }

        return new UserDto(user)
      }
    } catch (e) {
      throw e
    }
  }

  public async logout(refreshToken: string, accessToken: string) {
    try {
      if(!refreshToken || !accessToken) {
        throw ApiError.UnauthorizedError()
      }

      const decodedRefreshToken = await tokenService.validateRefreshToken(refreshToken);
      const decodedAccessToken = await tokenService.validateAccessToken(accessToken)

      if(typeof decodedRefreshToken === 'object' && typeof decodedAccessToken === 'object') {
        const refreshJti = decodedRefreshToken.jti;
        const accessJti = decodedAccessToken.jti;

        if(!refreshJti) {
          throw ApiError.UnauthorizedError()
        }

        await tokenService.deleteTokenByJti(accessJti!)
        await tokenService.deleteTokenByJti(refreshJti)
      }
    } catch (e) {
      throw e;
    }
  }

  private async findById(userID: string) {
    try {
      return await prismaClient.user.findFirst({
        where: {
          id: BigInt(userID)
        }
      });
    } catch (e) {
      throw e
    }
  }

  private async isUserExist(email: string): Promise<any> {
    const user = await prismaClient.user.findFirst({
      where: {
        email,
      }
    })

    return user
  }
}

export default new UserService();