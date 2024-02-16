"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_1 = __importDefault(require("../socket"));
socket_1.default.on('connection', (socket) => {
    socket_1.default.on('connection', (socket) => {
        socket.on('testing', (data) => {
            const refreshToken = socket.handshake.auth;
            console.log(refreshToken);
            // Отправить сообщение обратно клиенту
            socket.emit('message', { message: 'Received testing event' });
        });
    });
});
