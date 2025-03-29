// Import Express and Scalar
import { express, apiReference } from "./deps.ts";
import healthRouter, { healthApiSpec } from "./routes/health/health.routes.ts";
import tasksRouter, { tasksApiSpec } from "./routes/tasks/tasks.routes.ts";

// Get port from environment variable or default to 8000
const port = Deno.env.get("PORT") ? parseInt(Deno.env.get("PORT")!) : 8000;
const host = Deno.env.get("HOST") || "http://localhost:8000";
const env = Deno.env.get("NODE_ENV") || "development";

const app = express();

// Configure middleware
app.use(express.json());

// Mount routers
app.use(healthRouter);
app.use(tasksRouter);

// OpenAPI configuration
const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Auth API",
    version: "1.0.0",
    description: "A simple REST API built with Deno and Express",
  },
  servers: env === "development" 
    ? [
        {
          url: "http://localhost:8000",
          description: "Local Development Server",
        }
      ]
    : [
        {
          url: host,
          description: "Production Server",
        }
      ],
  tags: [
    {
      name: "Health",
      description: "Health check endpoints",
    },
    {
      name: "Tasks",
      description: "Task management endpoints",
    },
  ],
  paths: {
    ...healthApiSpec,
    ...tasksApiSpec,
  },
};

// Serve OpenAPI spec
app.get("/api-docs/json", (_req, res) => {
  res.json(openApiSpec);
});

// Serve API Reference UI using Scalar
app.use(
  "/api-docs",
  apiReference({
    spec: {
      url: "/api-docs/json",
    },
    theme: "default",
    layout: "classic",
  })
);

// Start the server
app.listen(port, () => {
  const baseUrl = env === "development" ? `http://localhost:${port}` : host;
  console.log("\x1b[32m%s\x1b[0m", `✨ Server running at ${baseUrl}`);
  console.log("\x1b[36m%s\x1b[0m", `📚 API Documentation available at ${baseUrl}/api-docs`);
});
