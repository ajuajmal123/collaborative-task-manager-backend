import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "./task.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const taskRoutes = Router();

taskRoutes.use(requireAuth);

taskRoutes.post("/", createTask);
taskRoutes.get("/", getTasks);
taskRoutes.put("/:id", updateTask);
taskRoutes.delete("/:id", deleteTask);

export default taskRoutes;
