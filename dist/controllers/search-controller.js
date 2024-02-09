"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const search_service_1 = __importDefault(require("../services/search-service"));
class SearchController {
    async addToSearchQueue(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const mode = req.body;
            await search_service_1.default.addToQueue(mode, refreshToken);
        }
        catch (e) {
            next(e);
        }
    }
}
exports.default = new SearchController();
