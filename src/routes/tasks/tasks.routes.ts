import { Request, Response } from "../../deps.ts";
import { Router } from "npm:express@4";
import { z } from "../../deps.ts";
import { tasksApiSpec } from "./tasks.api.ts";

const router = Router();

const createTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

router.post("/tasks", (req: Request, res: Response) => {
  try {
    const result = createTaskSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Invalid request body",
        details: result.error.errors,
      });
    }

    // For now, just echo back the task
    return res.status(201).json({
      id: crypto.randomUUID(),
      ...result.data,
      createdAt: new Date().toISOString(),
    });
  } catch (_error) {
    return res.status(400).json({
      error: "Invalid JSON",
    });
  }
});

export { tasksApiSpec };
export default router;
