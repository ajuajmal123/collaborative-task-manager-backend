import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI!,
  ACCESS_SECRET:process.env.ACCESS_SECRET!,
  REFRESH_SECRET:process.env.REFRESH_SECRET!,
  NODE_ENV: process.env.NODE_ENV || "development",
  APP_ORIGIN:process.env.APP_ORIGIN!,
};
