import cors from "cors";
import { env } from "./env";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  env.APP_ORIGIN 
];

export const corsOptions = cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.includes(origin);
    const isVercelPreview = /\.vercel\.app$/.test(origin);

    if (isAllowed || isVercelPreview) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // This is the "Credentials" Fix
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"], // Added "Cookie" here
});