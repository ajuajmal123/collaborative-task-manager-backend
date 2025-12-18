import {
  createTaskService,
  updateTaskService,
} from "../../modules/tasks/task.service";
import { Task } from "../../modules/tasks/task.model";
import { AppError } from "../../utils/AppError";

// 🔹 Mock Task model
jest.mock("../../modules/tasks/task.model");

// 🔹 Mock Socket.io
jest.mock("../../config/socket", () => ({
  getIO: () => ({
    emit: jest.fn(),
    to: jest.fn().mockReturnThis(),
  }),
}));

describe("Task Service", () => {
  const userId = "user123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a task successfully", async () => {
    const mockTask = {
      title: "Test Task",
      creatorId: userId,
    };

    (Task.create as jest.Mock).mockResolvedValue(mockTask);

    const result = await createTaskService(
      { title: "Test Task", dueDate: new Date() },
      userId
    );

    expect(Task.create).toHaveBeenCalledWith({
      title: "Test Task",
      dueDate: expect.any(Date),
      creatorId: userId,
    });

    expect(result).toEqual(mockTask);
  });

  it("should throw error if user is not task creator", async () => {
    (Task.findById as jest.Mock).mockResolvedValue({
      creatorId: { equals: () => false },
    });

    await expect(
      updateTaskService("task123", userId, { title: "Updated" })
    ).rejects.toThrow(AppError);
  });

  it("should throw error if task not found", async () => {
    (Task.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      updateTaskService("task123", userId, { title: "Updated" })
    ).rejects.toThrow("Task not found");
  });
});
