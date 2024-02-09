import {ApiError} from "../exceptions/api-error";
import tokenService from "../services/token-service";
import {AxiosRequestHeaders} from "axios";
import {NextFunction} from "express";

export async function authMiddleware(req: AxiosRequestHeaders, res, next) {
  try {
    const accessTokenWithBearer = req.headers.authorization;
    
    if(!accessTokenWithBearer) {
      return next(ApiError.UnauthorizedError())
    }

    const accessTokenWithoutBearer = accessTokenWithBearer.split(' ')[1];

    if(!accessTokenWithoutBearer) {
      return next(ApiError.UnauthorizedError())
    }

    const token =  await tokenService.validateAccessToken(accessTokenWithoutBearer);
    if(!token) {
      return next(ApiError.UnauthorizedError())
    }
    next()
  } catch (e) {
    return  next(ApiError.UnauthorizedError())
  }
}
