import { Task } from "./task.model";
import { AppError } from "../../utils/AppError";

export const createTaskService = async (data: any, userId: string) => {
  return Task.create({
    ...data,
    creatorId: userId,
  });
};

export const getTasksService = async (
  userId: string,
  filters: any,
  sort: any
) => {
  return Task.find({
    $or: [{ creatorId: userId }, { assignedToId: userId }],
    ...filters,
  }).sort(sort);
};

export const updateTaskService = async (
  taskId: string,
  userId: string,
  updates: any
) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError("Task not found", 404);

  if (!task.creatorId.equals(userId)) {
    throw new AppError("Not authorized", 403);
  }

  Object.assign(task, updates);
  return task.save();
};

export const deleteTaskService = async (taskId: string, userId: string) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError("Task not found", 404);

  if (!task.creatorId.equals(userId)) {
    throw new AppError("Not authorized", 403);
  }

  await task.deleteOne();
};
