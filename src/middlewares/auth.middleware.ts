import { Request, Response, NextFunction } from "express";

import { verifyAccessToken } from "../utils/jwt";

export const requireAuth = (req:Request, res:Response, next:NextFunction) => {
  const token = req.cookies.accessToken;
  if (!token) return res.sendStatus(401);

  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    return res.sendStatus(401);
  }
};

