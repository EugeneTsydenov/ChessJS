"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDto = void 0;
class UserDto {
    constructor(model) {
        this.email = model.email;
        this.username = model.username;
        this.avatar = model.avatar;
        this.createdAt = model.created_at;
    }
}
exports.UserDto = UserDto;
