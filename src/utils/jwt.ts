import jwt from "jsonwebtoken";
import { env } from "../config/env";

type JwtPayload = {
  userId: string;
};

export const signAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, env.ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

export const signRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.REFRESH_SECRET) as JwtPayload;
};
