export class UserDto {
  email: string;
  username: string;
  avatar: string;
  createdAt: string;
  isAuth: boolean

  constructor(model: any) {
    this.email = model.email;
    this.username = model.username;
    this.avatar = model.avatar;
    this.createdAt = model.created_at;
    this.isAuth = model.is_auth;
  }
}