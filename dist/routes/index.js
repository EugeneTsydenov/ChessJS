"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const user_controller_1 = __importDefault(require("../controllers/user-controller"));
const auth_middleware_1 = require("../middlewares/auth-middleware");
const socketService_1 = require("../services/socketService");
const router = (0, express_1.Router)();
router.post('/login', (0, express_validator_1.body)('email').isEmail(), (0, express_validator_1.body)('password').isLength({ min: 3, max: 8 }), user_controller_1.default.login);
router.post('/registration', (0, express_validator_1.body)('email').isEmail(), (0, express_validator_1.body)('password').isLength({ min: 3, max: 8 }), user_controller_1.default.registration);
router.post('/logout', user_controller_1.default.logout);
router.get('/refresh', user_controller_1.default.refresh);
router.get('/user', auth_middleware_1.authMiddleware, user_controller_1.default.getUser);
router.post('/test', (req, res, next) => {
    console.log(process.env.DATABASE_URL);
});
router.post('/play', auth_middleware_1.authMiddleware, (req, res) => {
    (0, socketService_1.emitSocketData)('search');
});
exports.default = router;
