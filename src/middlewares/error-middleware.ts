import {ApiError} from "../exceptions/api-error";
import {NextFunction} from "express";

export function errorMiddleware(err: Error, req:any, res:any, next: NextFunction) {
  if(err instanceof ApiError) {
    return res.status(err.status).json({message: err.message, errors: err.errors});
  }

  return next(err)
}