import cors from "cors";
import { env } from "./env";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  env.APP_ORIGIN 
];

export const corsOptions = cors({
  origin: (origin, callback) => {
    // 1. Allow if no origin (Postman/Server-to-server)
    if (!origin) return callback(null, true);

    // 2. Check against the explicit list
    const isAllowed = allowedOrigins.includes(origin);

    // 3. Check if it's a Vercel preview URL using regex
    const isVercelPreview = /\.vercel\.app$/.test(origin);

    if (isAllowed || isVercelPreview) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
});