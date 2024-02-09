"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const api_error_1 = require("../exceptions/api-error");
const token_service_1 = __importDefault(require("../services/token-service"));
async function authMiddleware(req, res, next) {
    try {
        const accessTokenWithBearer = req.headers.authorization;
        if (!accessTokenWithBearer) {
            return next(api_error_1.ApiError.UnauthorizedError());
        }
        const accessTokenWithoutBearer = accessTokenWithBearer.split(' ')[1];
        if (!accessTokenWithoutBearer) {
            return next(api_error_1.ApiError.UnauthorizedError());
        }
        const token = await token_service_1.default.validateAccessToken(accessTokenWithoutBearer);
        if (!token) {
            return next(api_error_1.ApiError.UnauthorizedError());
        }
        next();
    }
    catch (e) {
        return next(api_error_1.ApiError.UnauthorizedError());
    }
}
exports.authMiddleware = authMiddleware;
