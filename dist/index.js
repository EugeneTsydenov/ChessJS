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
const colyseus_1 = require("colyseus");
const node_http_1 = require("node:http");
const mode_rooms_1 = require("./rooms/mode-rooms");
exports.app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = Number(process.env.BASE_PORT) || 52718;
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use('/api', routes_1.default);
exports.app.use(error_middleware_1.errorMiddleware);
const gameServer = new colyseus_1.Server({
    server: (0, node_http_1.createServer)(exports.app)
});
gameServer.define('ultra-bullet', mode_rooms_1.UltraBulletRoom);
gameServer.define('bullet', mode_rooms_1.BulletRoom);
gameServer.define('ultra-blitz', mode_rooms_1.UltraBlitzRoom);
gameServer.define('hyper-blitz', mode_rooms_1.HyperBlitzRoom);
gameServer.define('super-blitz', mode_rooms_1.SuperBlitzRoom);
gameServer.define('blitz', mode_rooms_1.BlitzRoom);
gameServer.define('ultra-rapid', mode_rooms_1.UltraRapidRoom);
gameServer.define('hyper-rapid', mode_rooms_1.HyperRapidRoom);
gameServer.define('rapid', mode_rooms_1.RapidRoom);
gameServer.define('ultra-classical', mode_rooms_1.UltraClassicalRoom);
gameServer.define('classical', mode_rooms_1.ClassicalRoom);
gameServer.listen(PORT).then(() => {
    console.log(`Server started on ${PORT} port.`);
});
