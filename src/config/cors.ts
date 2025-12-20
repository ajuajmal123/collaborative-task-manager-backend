import cors from "cors";
import { env } from "./env";

export const corsOptions = cors({
  origin: (origin, callback) => {
 
    const allowedOrigins = [
      "http://localhost:3000", 
      env.APP_ORIGIN
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS Error: Origin ${origin} not allowed`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
});