import {ApiError} from "../exceptions/api-error";
import tokenService from "../services/token-service";
import {AxiosRequestHeaders, AxiosResponseHeaders} from "axios";
import {NextFunction} from "express";

export async function authMiddleware(req: AxiosRequestHeaders, res: AxiosResponseHeaders, next: NextFunction) {
  try {
    const {accessToken} = req.cookies;
    
    if(!accessToken) {
      return next(ApiError.UnauthorizedError())
    }

    const accessTokenWithoutBearer = accessToken.split(' ')[1];

    if(!accessTokenWithoutBearer) {
      return next(ApiError.UnauthorizedError())
    }

    const token =  await tokenService.validateAccessToken(accessTokenWithoutBearer);
    if(!token) {
      return next(ApiError.UnauthorizedError())
    }
    res.cookie('accessToken',`Bearer ${token}`, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
    next()
  } catch (e) {
    return  next(ApiError.UnauthorizedError())
  }
}
