"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_client_1 = require("../prisma-client");
const node_crypto_1 = require("node:crypto");
class TokenService {
    async generateTokens(userID) {
        const accessJti = (0, node_crypto_1.randomUUID)();
        const refreshJti = (0, node_crypto_1.randomUUID)();
        const accessToken = jsonwebtoken_1.default.sign({ userID: Number(userID) }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m', jwtid: accessJti });
        const refreshToken = jsonwebtoken_1.default.sign({ userID: Number(userID) }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d', jwtid: refreshJti });
        return {
            accessToken,
            refreshToken,
            accessJti,
            refreshJti
        };
    }
    async addTokens(userId) {
        try {
            await prisma_client_1.prismaClient.token.deleteMany({
                where: {
                    user_id: userId,
                },
            });
            const { accessToken, refreshToken, accessJti, refreshJti } = await this.generateTokens(userId);
            const refreshTokenDb = await prisma_client_1.prismaClient.token.create({
                data: {
                    token_type: 2,
                    user_id: userId,
                    is_revoked: false,
                    jti: refreshJti
                },
            });
            const accessTokenDb = await prisma_client_1.prismaClient.token.create({
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
        }
        catch (e) {
            throw e;
        }
    }
    async parseToken(token) {
        return jsonwebtoken_1.default.decode(token);
    }
    async validateAccessToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
        }
        catch (e) {
            throw e;
        }
    }
    async validateRefreshToken(token) {
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
            if (!decodedToken) {
                throw new Error('error');
            }
            return decodedToken;
        }
        catch (e) {
            throw e;
        }
    }
    async deleteTokenByJti(jti) {
        try {
            await prisma_client_1.prismaClient.token.deleteMany({
                where: {
                    jti: jti
                }
            });
        }
        catch (e) {
            throw e;
        }
    }
    async findTokenByJti(jti) {
        try {
            return await prisma_client_1.prismaClient.token.findFirst({
                where: {
                    jti: jti
                }
            });
        }
        catch (e) {
            throw e;
        }
    }
}
exports.default = new TokenService();
