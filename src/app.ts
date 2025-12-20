import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.route";
import { corsOptions } from "./config/cors";
import { errorHandler } from "./middlewares/error.middleware";
import taskRoutes from "./modules/tasks/task.route";

const app = express();


app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    // This regex removes invisible control characters (\x00-\x1F) and trailing spaces
    const sanitizedOrigin = origin.trim().replace(/[\x00-\x1F\x7F-\x9F]/g, "");
    req.headers.origin = sanitizedOrigin;
  }
  next();
});


app.set("trust proxy", 1);
app.use(corsOptions);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use(errorHandler);

export default app;