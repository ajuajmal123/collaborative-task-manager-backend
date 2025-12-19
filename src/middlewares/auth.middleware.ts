import { Request, Response, NextFunction } from "express";

import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";

export const requireAuth = (req:Request, _res:Response, next:NextFunction) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return next(new AppError("Unauthorized", 401));
  }

  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    next(new AppError("Unauthorized", 401));
  }
};

