export class UserDto {
  email: string;
  username: string;
  avatar: string;
  createdAt: string;

  constructor(model: any) {
    this.email = model.email;
    this.username = model.username;
    this.avatar = model.avatar;
    this.createdAt = model.created_at;
  }
}