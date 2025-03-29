import { z } from "../../deps.ts";
import { createRoute } from "../../lib/create-route.ts";

const healthResponseSchema = z.object({
  status: z.string(),
  timestamp: z.string().datetime(),
});

export const getHealth = createRoute({
  path: "/healthcheck",
  method: "get",
  tags: ["Health"],
  summary: "Health check endpoint",
  description: "Returns the current health status of the API",
  response: healthResponseSchema,
  handler: (ctx) => {
    ctx.response.body = {
      status: "healthy",
      timestamp: new Date().toISOString(),
    };
  },
});
