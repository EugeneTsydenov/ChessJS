import {ApiError} from "../exceptions/api-error";
import tokenService from "../services/token-service";

export async function authMiddleware(req:any, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if(!authorizationHeader) {
      return next(ApiError.UnauthorizedError())
    }

    const accessToken = authorizationHeader.split(' ')[1];

    if(!accessToken) {
      return next(ApiError.UnauthorizedError())
    }

    const token =  await tokenService.validateAccessToken(accessToken);
    if(!token) {
      return next(ApiError.UnauthorizedError())
    }
    req.headers.authorization = token;
    next()
  } catch (e) {
    return  next(ApiError.UnauthorizedError())
  }
}
