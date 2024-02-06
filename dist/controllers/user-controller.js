"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../services/user-service"));
const express_validator_1 = require("express-validator");
const api_error_1 = require("../exceptions/api-error");
const user_service_2 = __importDefault(require("../services/user-service"));
class UserController {
    async registration(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return next(api_error_1.ApiError.BadRequest('Error validating email or password!'));
            }
            const newUser = req.body;
            const tokens = await user_service_1.default.registration(newUser);
            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            res.cookie('accessToken', `Bearer ${tokens.accessToken}`, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json({ message: 'You have successfully logged in!' });
        }
        catch (e) {
            return next(e);
        }
    }
    async login(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return next(api_error_1.ApiError.BadRequest('Error validating email or password!'));
            }
            const user = req.body;
            const tokens = await user_service_1.default.login(user);
            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            res.cookie('accessToken', `Bearer ${tokens.accessToken}`, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json({ message: 'You have successfully logged in!' });
        }
        catch (e) {
            next(e);
        }
    }
    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            await user_service_2.default.logout(refreshToken);
            res.clearCookie('refreshToken');
            res.clearCookie('accessToken');
            return res.json({ message: 'You successfully logout!' });
        }
        catch (e) {
            next(e);
        }
    }
    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const tokens = await user_service_2.default.refresh(refreshToken);
            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            res.cookie('accessToken', `Bearer ${tokens.accessToken}`, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json({ message: 'success' });
        }
        catch (e) {
            next(e);
        }
    }
    async getUser(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await user_service_2.default.getUser(refreshToken);
            return res.json(userData);
        }
        catch (e) {
            next(e);
        }
    }
}
exports.default = new UserController();
