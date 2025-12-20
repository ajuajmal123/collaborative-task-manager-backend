import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  
  if (!accessToken && !refreshToken) {
    throw new AppError("Unauthorized", 401);
  }


  if (accessToken) {
    try {
      const payload = jwt.verify(
        accessToken,
        process.env.ACCESS_SECRET!
      ) as any;

      req.userId = payload.userId;
      return next();
    } catch (err) {
      
    }
  }

  if (refreshToken) {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET!
      ) as any;

      
      const newAccessToken = jwt.sign(
        { userId: payload.userId },
        process.env.ACCESS_SECRET!,
        { expiresIn: "15m" }
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  secure: env.NODE_ENV === "production",
      });

      req.userId = payload.userId;
      return next();
    } catch {
      throw new AppError("Unauthorized", 401);
    }
  }

  throw new AppError("Unauthorized", 401);
};
