import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().max(100),
  description: z.string().optional(),
  dueDate: z.string().datetime(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  assignedToId: z.string(),
});

export const updateTaskSchema = z.object({
  title: z.string().max(100).optional(),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  status: z
    .enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"])
    .optional(),
  assignedToId: z.string().optional(),
});
