import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  console.log("--- Auth Check ---");
  console.log("Origin Header:", req.headers.origin);
  console.log("Cookies received by Server:", req.cookies);
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // 1. Try Access Token
  if (accessToken) {
    try {
      const payload = jwt.verify(accessToken, process.env.ACCESS_SECRET!) as any;
      req.userId = payload.userId;
      return next();
    } catch (err) {
     
      console.log("Access token expired, attempting refresh...");
    }
  }

  // 2. Try Refresh Token
  if (refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as any;
      
      const newAccessToken = jwt.sign(
        { userId: payload.userId },
        process.env.ACCESS_SECRET!,
        { expiresIn: "15m" }
      );

      
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });

      req.userId = payload.userId;
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Session expired" });
    }
  }

  return res.status(401).json({ message: "Unauthorized" });
};
