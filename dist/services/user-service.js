"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_client_1 = require("../prisma-client");
const api_error_1 = require("../exceptions/api-error");
const token_service_1 = __importDefault(require("./token-service"));
const token_service_2 = __importDefault(require("./token-service"));
const user_dto_1 = require("../dtos/user-dto");
class UserService {
    async registration(user) {
        try {
            if (!!await this.isUserExist(user.email)) {
                throw api_error_1.ApiError.BadRequest(`A user with the same email: ${user.email} already exists!`);
            }
            const hashPassword = await bcrypt_1.default.hash(user.password, 10);
            const userDB = await prisma_client_1.prismaClient.user.create({
                data: {
                    email: user.email,
                    username: user.username,
                    hash_password: hashPassword,
                    is_auth: true,
                }
            });
            return await token_service_1.default.addToken(userDB.id);
        }
        catch (e) {
            throw e;
        }
    }
    async login(user) {
        try {
            const userDB = await this.isUserExist(user.email);
            if (!userDB) {
                throw api_error_1.ApiError.BadRequest('User not found!');
            }
            const passwordMatch = await bcrypt_1.default.compare(user.password, userDB.hash_password);
            if (!passwordMatch) {
                throw api_error_1.ApiError.BadRequest('Incorrect password!');
            }
            await prisma_client_1.prismaClient.user.update({
                where: {
                    id: userDB.id
                },
                data: {
                    is_auth: true
                }
            });
            return await token_service_1.default.addToken(userDB.id);
        }
        catch (e) {
            throw e;
        }
    }
    async refresh(refreshToken) {
        try {
            if (!refreshToken) {
                throw api_error_1.ApiError.UnauthorizedError();
            }
            const isValidToken = await token_service_2.default.validateRefreshToken(refreshToken);
            const refreshTokenDB = await token_service_2.default.findToken(refreshToken);
            if (!refreshTokenDB || !isValidToken) {
                throw api_error_1.ApiError.UnauthorizedError();
            }
            const user = await this.findById(refreshTokenDB.user_id);
            if (!user) {
                throw api_error_1.ApiError.BadRequest('missing');
            }
            return await token_service_1.default.addToken(user.id);
        }
        catch (e) {
            throw e;
        }
    }
    async logout(refreshToken) {
        try {
            const refreshTokenDB = await token_service_2.default.findToken(refreshToken);
            if (!refreshTokenDB) {
                throw api_error_1.ApiError.BadRequest('Bad request');
            }
            const userId = refreshTokenDB.user_id;
            await token_service_2.default.deleteTokenByToken(refreshTokenDB.token);
            await prisma_client_1.prismaClient.user.update({
                where: {
                    id: userId,
                },
                data: {
                    is_auth: false
                }
            });
        }
        catch (e) {
            throw e;
        }
    }
    async findById(userID) {
        try {
            const userDB = await prisma_client_1.prismaClient.user.findFirst({
                where: {
                    id: userID
                }
            });
            return userDB;
        }
        catch (e) {
            throw e;
        }
    }
    async isUserExist(email) {
        const user = await prisma_client_1.prismaClient.user.findFirst({
            where: {
                email,
            }
        });
        return user;
    }
    async getUser(refreshToken) {
        try {
            const refreshTokenDB = await token_service_2.default.findToken(refreshToken);
            if (!refreshTokenDB) {
                throw api_error_1.ApiError.BadRequest('Bad request');
            }
            const userId = refreshTokenDB.user_id;
            const user = await this.findById(userId);
            if (!user) {
                throw api_error_1.ApiError.BadRequest('Bad request');
            }
            return new user_dto_1.UserDto(user);
        }
        catch (e) {
            throw e;
        }
    }
}
exports.default = new UserService();
