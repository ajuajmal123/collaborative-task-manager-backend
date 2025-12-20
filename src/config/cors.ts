import cors from "cors";
import { env } from "./env";

export const corsOptions = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      env.APP_ORIGIN
     
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, 
});
