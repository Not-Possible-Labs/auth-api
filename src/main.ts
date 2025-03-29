import { Application, Router } from "./deps.ts";
import { generateOpenAPI } from "./lib/generate-openapi.ts";
import { getHealth } from "./routes/health/health.routes.ts";
import { createUser } from "./routes/users/users.routes.ts";

const app = new Application();
const router = new Router();

// Configure routes
const routes = [getHealth, createUser];

// Register route handlers
routes.forEach((route) => {
  switch (route.method) {
    case "get":
      router.get(route.path, route.handler);
      break;
    case "post":
      router.post(route.path, route.handler);
      break;
    case "put":
      router.put(route.path, route.handler);
      break;
    case "delete":
      router.delete(route.path, route.handler);
      break;
    case "patch":
      router.patch(route.path, route.handler);
      break;
  }
});

// OpenAPI configuration
const swaggerOptions = {
  info: {
    title: "Auth API",
    version: "1.0.0",
    description: "A simple REST API built with Deno and Oak",
  },
  servers: [
    {
      url: "http://localhost:8000",
      description: "Local Development Server",
    },
  ],
  tags: [
    {
      name: "Health",
      description: "Health check endpoints",
    },
    {
      name: "Users",
      description: "User management endpoints",
    },
  ],
};

// Generate OpenAPI documentation
const openApiDoc = generateOpenAPI({
  ...swaggerOptions,
  routes,
});

// Serve OpenAPI JSON
router.get("/api-docs/json", (ctx) => {
  ctx.response.headers.set("Content-Type", "application/json");
  ctx.response.body = openApiDoc;
});

// Serve API Reference UI
router.get("/api-docs", (ctx) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>API Documentation</title>
  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</head>
<body>
  <script type="module">
    const ref = document.createElement('scalar-api-reference');
    ref.setAttribute('spec-url', '/api-docs/json');
    document.body.appendChild(ref);
  </script>
</body>
</html>`;

  ctx.response.headers.set("Content-Type", "text/html");
  ctx.response.body = html;
});

app.use(router.routes());
app.use(router.allowedMethods());

// Get port from environment variable or default to 8000
const port = Deno.env.get("PORT") ? parseInt(Deno.env.get("PORT")!) : 8000;

console.log(`Server running at http://localhost:${port}`);
console.log(`API Documentation available at http://localhost:${port}/api-docs`);
await app.listen({ port });
