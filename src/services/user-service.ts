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
          is_auth: true,
        }
      })

      return await TokenService.addToken(userDB.id);
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

      prismaClient.user.update({
        where: {
          id: userDB.id
        },
        data: {
          is_auth: true
        }
      })

      return await TokenService.addToken(userDB.id);
    } catch (e) {
      throw e;
    }
  }

  public async refresh(refreshToken:string) {
    try {
      if(!refreshToken) {
        throw ApiError.UnauthorizedError();
      }
      const isValidToken = await tokenService.validateRefreshToken(refreshToken);
      const refreshTokenDB = await tokenService.findToken(refreshToken);

      if (!refreshTokenDB || !isValidToken) {
        throw ApiError.UnauthorizedError()
      }

      const user = await this.findById(refreshTokenDB.user_id);

      if(!user) {
        throw ApiError.BadRequest('missing')
      }

      return await TokenService.addToken(user.id)
    } catch (e) {
      throw e
    }
  }

  public async logout(refreshToken: string) {
    try {
      const refreshTokenDB = await tokenService.findToken(refreshToken);

      if(!refreshTokenDB) {
        throw ApiError.BadRequest('Bad request')
      }

      const userId = refreshTokenDB.user_id;
      await tokenService.deleteTokenByUserId(userId);

      prismaClient.user.update({
        where: {
          id: userId,
        },
        data: {
          is_auth: false
        }
      });
    } catch (e) {
      throw e;
    }
  }

  private async findById(userID: string) {
    try {
      const userDB = prismaClient.user.findFirst({
        where: {
          id: userID
        }
      });

      return userDB;
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

  public async getUser(refreshToken: string) {
    try {
      const refreshTokenDB = await tokenService.findToken(refreshToken);

      if(!refreshTokenDB) {
        throw ApiError.BadRequest('Bad request')
      }

      const userId = refreshTokenDB.user_id;
      const user = await this.findById(userId);

      if(!user) {
        throw ApiError.BadRequest('Bad request')
      }

      return new UserDto(user);
    } catch (e) {
      throw e
    }
  }
}

export default new UserService();