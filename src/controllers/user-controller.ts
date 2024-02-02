import { Request, Response, NextFunction } from "express";
import UserService from "../services/user-service";
import {IAuthUser} from "../models/IAuthUser";
import {validationResult} from "express-validator";
import {ApiError} from "../exceptions/api-error";
import userService from "../services/user-service";

class UserController {
  public async registration(req:  Request, res: Response, next: NextFunction):Promise<any> {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return next(ApiError.BadRequest('Error validating email or password!'))
      }
      const newUser: IAuthUser = req.body;
      const tokens = await UserService.registration(newUser);
      res.cookie('refreshToken',tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
      res.cookie('accessToken',`Bearer ${tokens.accessToken}`, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
      return res.json({message: 'You have successfully logged in!'});
    } catch (e: any) {
      return next(e)
    }
  }

  public async login(req:  Request, res: Response, next: NextFunction):Promise<any> {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return next(ApiError.BadRequest('Error validating email or password!'))
      }
      const user: IAuthUser = req.body;
      const  tokens =await UserService.login(user);
      res.cookie('refreshToken',tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
      res.cookie('accessToken',`Bearer ${tokens.accessToken}`, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
      return res.json({message: 'You have successfully logged in!'});
    } catch (e: any) {
      next(e)
    }
  }

  public async logout(req:  Request, res: Response, next: NextFunction):Promise<any> {
    try {
      const {refreshToken} = req.cookies;
      await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');
      return res.json({message: 'You successfully logout!'});
    } catch (e) {
      next(e);
    }
  }

  public async refresh(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const {refreshToken} = req.cookies;
      const tokens = await userService.refresh(refreshToken);
      res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
      res.cookie('accessToken',`Bearer ${tokens.accessToken}`, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
      return res.json({message: 'success'});
    } catch (e) {
      next(e)
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const {refreshToken} = req.cookies;
      const userData = await userService.getUser(refreshToken);
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

}

export default new UserController();