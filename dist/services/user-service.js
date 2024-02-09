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
                }
            });
            return await token_service_1.default.addTokens(userDB.id);
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
            await prisma_client_1.prismaClient.user.findFirst({
                where: {
                    id: userDB.id
                }
            });
            return await token_service_1.default.addTokens(userDB.id);
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    async refresh(refreshToken) {
        try {
            if (!refreshToken) {
                throw api_error_1.ApiError.UnauthorizedError();
            }
            const decodedToken = await token_service_2.default.validateRefreshToken(refreshToken);
            if (typeof decodedToken === 'object') {
                const jti = decodedToken?.jti;
                const tokenFromDB = jti && await token_service_2.default.findTokenByJti(jti);
                if (!tokenFromDB) {
                    throw api_error_1.ApiError.UnauthorizedError();
                }
                if (Number(tokenFromDB.user_id) !== decodedToken.userID) {
                    throw api_error_1.ApiError.UnauthorizedError();
                }
                return await token_service_2.default.addTokens(tokenFromDB.user_id);
            }
        }
        catch (e) {
            throw e;
        }
    }
    async getUser(refreshToken) {
        try {
            const decodedToken = await token_service_2.default.validateRefreshToken(refreshToken);
            if (typeof decodedToken === 'object') {
                const userId = decodedToken.userID;
                if (!userId) {
                    throw api_error_1.ApiError.UnauthorizedError();
                }
                const user = await this.findById(userId);
                if (!user) {
                    throw api_error_1.ApiError.UnauthorizedError();
                }
                return new user_dto_1.UserDto(user);
            }
        }
        catch (e) {
            throw e;
        }
    }
    async logout(refreshToken, accessToken) {
        try {
            if (!refreshToken || !accessToken) {
                throw api_error_1.ApiError.UnauthorizedError();
            }
            const decodedRefreshToken = await token_service_2.default.validateRefreshToken(refreshToken);
            const decodedAccessToken = await token_service_2.default.validateAccessToken(accessToken);
            if (typeof decodedRefreshToken === 'object' && typeof decodedAccessToken === 'object') {
                const refreshJti = decodedRefreshToken.jti;
                const accessJti = decodedAccessToken.jti;
                if (!refreshJti) {
                    throw api_error_1.ApiError.UnauthorizedError();
                }
                await token_service_2.default.deleteTokenByJti(accessJti);
                await token_service_2.default.deleteTokenByJti(refreshJti);
            }
        }
        catch (e) {
            throw e;
        }
    }
    async findById(userID) {
        try {
            return await prisma_client_1.prismaClient.user.findFirst({
                where: {
                    id: BigInt(userID)
                }
            });
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
}
exports.default = new UserService();
