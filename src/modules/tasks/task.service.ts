import { Task } from "./task.model";
import { AppError } from "../../utils/AppError";
import { getIO } from "../../config/socket";

/* ============================
   CREATE TASK
   ============================ */
export const createTaskService = async (data: any, userId: string) => {
const task = new Task({
  ...data,
  creatorId: userId,
});

await task.save();
  const io = getIO();

  // Refresh task lists
  io.emit("task:created", task);

  /* ============================
     NOTIFY ASSIGNEE ON CREATION
     ============================ */
  if (task.assignedToId) {
    io.to(`user:${task.assignedToId}`).emit(
      "notification:taskAssigned",
      {
        message: "A task has been assigned to you",
        task,
      }
    );
  }

  return task;
};


/* ============================
   GET TASKS
   ============================ */
export const getTasksService = async (
  userId: string,
  view: string,
  filters: any,
  sort: any
) => {
  const baseQuery: any = { ...filters };

  if (view === "assigned") {
    baseQuery.assignedToId = userId;
  }

  if (view === "created") {
    baseQuery.creatorId = userId;
  }

  if (view === "overdue") {
    baseQuery.assignedToId = userId;
    baseQuery.dueDate = { $lt: new Date() };
    baseQuery.status = { $ne: "COMPLETED" };
  }

  // Safety fallback
  if (!view) {
    baseQuery.$or = [
      { creatorId: userId },
      { assignedToId: userId },
    ];
  }

  return Task.find(baseQuery)
    .populate("creatorId", "name email")
    .populate("assignedToId", "name email")
    .sort(sort);
};

/* ============================
   UPDATE TASK
   ============================ */
export const updateTaskService = async (
  taskId: string,
  userId: string,
  updates: any
) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError("Task not found", 404);

  const isCreator = task.creatorId.equals(userId);
  const isAssignee = task.assignedToId.equals(userId);

  if (!isCreator && !isAssignee) {
    throw new AppError("Not authorized", 403);
  }

  // Assignee restriction
  if (!isCreator && isAssignee) {
    if (Object.keys(updates).some(k => k !== "status")) {
      throw new AppError("Only status can be updated", 403);
    }
  }

  const previousAssignee = task.assignedToId.toString();

  Object.assign(task, updates);
  await task.save();

  const io = getIO();

  // Refresh task lists
  io.emit("task:updated", task);

  /* ============================
     REAL-TIME ASSIGNMENT NOTIFICATION
     ============================ */
  if (
    isCreator &&
    updates.assignedToId &&
    updates.assignedToId !== previousAssignee
  ) {
    io.to(`user:${updates.assignedToId}`).emit(
      "notification:taskAssigned",
      {
        message: "A task has been assigned to you",
        task,
      }
    );
  }

  return task;
};

/* ============================
   DELETE TASK
   ============================ */
export const deleteTaskService = async (taskId: string, userId: string) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError("Task not found", 404);

  if (!task.creatorId.equals(userId)) {
    throw new AppError("Not authorized", 403);
  }

  await task.deleteOne();

  const io = getIO();
  io.emit("task:deleted", taskId);
};
