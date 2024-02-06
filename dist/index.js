"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middlewares/error-middleware");
exports.app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = process.env.BASE_PORT || 52718;
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use('/api', routes_1.default);
exports.app.use(error_middleware_1.errorMiddleware);
const start = () => {
    try {
        exports.app.listen(PORT, async () => {
            console.log(`Server started on ${PORT} port.`);
        });
    }
    catch (e) {
        console.log(e, 2);
    }
};
start();
