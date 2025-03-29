# Task API

A modern REST API built with Deno and Oak, featuring automatic OpenAPI documentation generation and type-safe routing.

## Project Structure

```
src/
├── deps.ts                    # All external dependencies
├── lib/
│   ├── create-route.ts        # Route creation helper with OpenAPI support
│   ├── generate-openapi.ts    # OpenAPI documentation generator
│   └── types.ts              # TypeScript types for routes and OpenAPI
├── routes/
│   ├── health/
│   │   └── health.routes.ts  # Health check endpoint
│   └── tasks/
│       ├── route.ts          # Task routes
│       └── schema.ts         # Task schemas
└── main.ts                   # Application entry point
```

## Getting Started

1. Install Deno if you haven't already: https://deno.land/manual/getting_started/installation

2. Run the development server:
   ```bash
   deno task dev
   ```

The server will start at `http://localhost:8000` with the following endpoints:
- `/` - Root endpoint
- `/healthcheck` - Health check
- `/tasks` - Task creation
- `/api-docs` - Swagger UI documentation
- `/api-docs/json` - OpenAPI JSON specification

## Adding New Routes

To add a new route:

1. Create a new directory under `src/routes/` for your resource (use plural form, e.g., `orders`)

2. Create two files in your new directory:
   - `route.ts` - Contains your route definitions
   - `schema.ts` - Contains Zod schemas for request/response validation

3. Define your route using the `createRoute` helper:

```typescript
// Example: src/routes/tasks/route.ts
import { z } from "../../deps.ts";
import { Context } from "../../deps.ts";
import { createRoute } from "../../lib/create-route.ts";
import { createTaskSchema } from "./schema.ts";

export const createTask = createRoute({
  path: "/tasks",
  method: "post",
  tags: ["Tasks"],
  summary: "Create a new task",
  description: "Creates a new task with the provided details",
  body: createTaskSchema,
  response: z.object({
    id: z.string(),
    // ... other response fields
  }),
  handler: async (ctx: Context) => {
    // Your route handler logic here
  },
});
```

4. Update `src/main.ts` to include your new route:

```typescript
// src/main.ts
import { createTask } from "./routes/tasks/route.ts";

// Add to routes array
const routes = [getHealth, createTask];
```

## Route Definition

Each route must include:
- `path`: The URL path for the route
- `method`: HTTP method (get, post, put, delete, patch)
- `tags`: Array of tags for OpenAPI documentation
- `summary`: Brief description of the route
- `description`: Detailed description of the route
- `body`: Zod schema for request body validation
- `response`: Zod schema for response validation
- `handler`: The route handler function

## OpenAPI Documentation

OpenAPI documentation is automatically generated from your route definitions. No manual updates are required when adding new routes.

The documentation is available at:
- `/api-docs` - Swagger UI interface
- `/api-docs/json` - Raw OpenAPI JSON specification

## Type Safety

The project uses TypeScript with strict type checking. All routes and schemas are type-safe:

1. Route handlers receive properly typed `Context` objects
2. Request bodies are validated against Zod schemas
3. Response objects are validated against Zod schemas
4. OpenAPI documentation is generated from the same schemas used for validation

## Dependencies

The project uses the following dependencies:
- Deno standard library
- Oak framework
- Zod for schema validation
- @asteasolutions/zod-to-openapi for OpenAPI generation

## Contributing

1. Create a new branch for your feature
2. Add your new routes following the project structure
3. Update the routes array in `src/main.ts`
4. Submit a pull request

## License

MIT License
