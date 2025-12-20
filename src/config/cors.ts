import cors from "cors";
import { env } from "./env";


const originFromEnv = env.APP_ORIGIN?.trim(); 

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  originFromEnv 
].filter(Boolean) as string[];



export const corsOptions = cors({
  origin: (origin, callback) => {
    // If no origin (like Postman or server-to-server), allow it
    if (!origin) return callback(null, true);

    // CRITICAL: Clean the incoming origin string before comparing
    const cleanOrigin = origin.trim().replace(/[\n\r]/g, "");

    const isAllowed = allowedOrigins.includes(cleanOrigin);
    const isVercelPreview = /\.vercel\.app$/.test(cleanOrigin);

    if (isAllowed || isVercelPreview) {
      // Return the CLEANED origin
      callback(null, cleanOrigin); 
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
});