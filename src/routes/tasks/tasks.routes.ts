import { z } from "../../deps.ts";
import { Context } from "../../deps.ts";
import { createRoute } from "../../lib/create-route.ts";

const createTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(["pending", "in_progress", "completed"]),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

export const createTask = createRoute({
  path: "/tasks",
  method: "post",
  tags: ["Tasks"],
  summary: "Create a new task",
  description: "Creates a new task with the provided details",
  body: createTaskSchema,
  response: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    status: z.enum(["pending", "in_progress", "completed"]),
    priority: z.enum(["low", "medium", "high"]).optional(),
    createdAt: z.string().datetime(),
  }),
  handler: async (ctx: Context) => {
    const body = await ctx.request.body({ type: "json" }).value;
    const result = createTaskSchema.safeParse(body);

    if (!result.success) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid input" };
      return;
    }

    ctx.response.status = 201;
    ctx.response.body = {
      id: crypto.randomUUID(),
      ...result.data,
      createdAt: new Date().toISOString(),
    };
  },
});
