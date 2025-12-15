import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.route";
import { corsOptions } from "./config/cors";
import { errorHandler } from "./middlewares/error.middleware";
import taskRoutes from "./modules/tasks/task.route";
const app = express();
app.use(corsOptions);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/auth",taskRoutes)
app.use(errorHandler);
export default app;
