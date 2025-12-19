import { Request, Response } from "express";
import {
  createTaskService,
  getTasksService,
  updateTaskService,
  deleteTaskService,
} from "./task.service";
import { createTaskSchema, updateTaskSchema } from "./task.dto";

/**
 * CREATE TASK
 */
export const createTask = async (req: Request, res: Response) => {
  try {
    const parsed = createTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const userId = req.userId?.toString();
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const task = await createTaskService(parsed.data, userId);
    return res.status(201).json(task);
  } catch {
    return res.status(500).json({ message: "Failed to create task" });
  }
};

/**
 * GET TASKS
 */
export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.userId?.toString();
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      view,
      status,
      priority,
      sortByDueDate,
    } = req.query;

    const filters: any = {};

    if (typeof status === "string") {
      filters.status = status;
    }

    if (typeof priority === "string") {
      filters.priority = priority;
    }

    let sort: any = {};
    if (sortByDueDate === "asc") sort = { dueDate: 1 };
    if (sortByDueDate === "desc") sort = { dueDate: -1 };

    const tasks = await getTasksService(
      userId,
      view as string,
      filters,
      sort
    );

    return res.json(tasks);
  } catch {
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
};


/**
 * UPDATE TASK
 */
export const updateTask = async (req: Request, res: Response) => {
  try {
    const parsed = updateTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const userId = req.userId?.toString();
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const taskId = req.params.id;
    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const task = await updateTaskService(
      taskId,
      userId,
      parsed.data
    );

    return res.json(task);
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({
      message: err.message || "Failed to update task",
    });
  }
};

/**
 * DELETE TASK
 */
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const userId = req.userId?.toString();
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const taskId = req.params.id;
    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    await deleteTaskService(taskId, userId);
    return res.status(204).send();
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({
      message: err.message || "Failed to delete task",
    });
  }
};
