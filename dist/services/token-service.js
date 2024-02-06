"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_client_1 = require("../prisma-client");
class TokenService {
    async generateTokens(userID) {
        const accessToken = jsonwebtoken_1.default.sign({ userID: userID }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({ userID: userID }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
        return {
            accessToken,
            refreshToken
        };
    }
    async addToken(userId) {
        try {
            await prisma_client_1.prismaClient.refreshToken.deleteMany({
                where: {
                    user_id: userId,
                },
            });
            const { accessToken, refreshToken } = await this.generateTokens(userId);
            const refreshTokenDb = await prisma_client_1.prismaClient.refreshToken.create({
                data: {
                    token: refreshToken,
                    user_id: userId
                },
            });
            return {
                refreshToken: refreshTokenDb.token,
                accessToken: accessToken,
            };
        }
        catch (e) {
            throw e;
        }
    }
    async validateAccessToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
        }
        catch (e) {
            console.log(e, 'dsaew');
            throw e;
        }
    }
    async validateRefreshToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
        }
        catch (e) {
            return null;
        }
    }
    async deleteTokenByToken(token) {
        try {
            await prisma_client_1.prismaClient.refreshToken.deleteMany({
                where: {
                    token: token
                }
            });
        }
        catch (e) {
            throw e;
        }
    }
    async findToken(refreshToken) {
        try {
            return await prisma_client_1.prismaClient.refreshToken.findFirst({
                where: {
                    token: refreshToken
                }
            });
        }
        catch (e) {
            throw e;
        }
    }
}
exports.default = new TokenService();
