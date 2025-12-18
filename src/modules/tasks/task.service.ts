import { Task } from "./task.model";
import { AppError } from "../../utils/AppError";
import { getIO } from "../../config/socket";
import { getSocketIdByUser } from "../../utils/socketUsers";
export const createTaskService = async (data: any, userId: string) => {
  const task = await Task.create({
    ...data,
    creatorId: userId,
  });

  const io = getIO();
  io.emit("task:created", task);

  return task;
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

  const previousAssignee = task.assignedToId.toString();

  Object.assign(task, updates);
  await task.save();

  const io = getIO();

  // Update all dashboards
  io.emit("task:updated", task);

  // Notify new assignee
  if (
    updates.assignedToId &&
    updates.assignedToId !== previousAssignee
  ) {
    const socketId = getSocketIdByUser(
      updates.assignedToId.toString()
    );

    if (socketId) {
      io.to(socketId).emit("notification:taskAssigned", {
        message: "A task has been assigned to you",
        task,
      });
    }
  }

  return task;
};


export const deleteTaskService = async (taskId: string, userId: string) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError("Task not found", 404);

  if (!task.creatorId.equals(userId)) {
    throw new AppError("Not authorized", 403);
  }

  await task.deleteOne();
};
