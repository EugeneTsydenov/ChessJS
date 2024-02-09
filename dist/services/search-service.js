"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_service_1 = __importDefault(require("./token-service"));
const api_error_1 = require("../exceptions/api-error");
class SearchService {
    async addToQueue(mode, refreshToken) {
        try {
            const decodedRefreshToken = await token_service_1.default.validateRefreshToken(refreshToken);
            if (typeof decodedRefreshToken === 'object') {
                const jtiRefresh = decodedRefreshToken?.jti;
                const refreshTokenFromDb = jtiRefresh && await token_service_1.default.findTokenByJti(jtiRefresh);
                if (!refreshTokenFromDb) {
                    throw api_error_1.ApiError.UnauthorizedError();
                }
                if (Number(refreshTokenFromDb.user_id) !== decodedRefreshToken.userID) {
                    throw api_error_1.ApiError.UnauthorizedError();
                }
            }
        }
        catch (e) {
            throw e;
        }
    }
}
exports.default = new SearchService();
