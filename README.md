# Auth API

A simple REST API built with Deno and Express.

## Features

- Express-based REST API
- TypeScript with strict type checking
- Zod schema validation
- OpenAPI documentation with Scalar
- Environment configuration
- Health check endpoint
- Task management endpoints

## Getting Started

### Prerequisites

- [Deno](https://deno.land/) installed on your machine
- Git for version control

### Installation

1. Clone the repository
2. Copy `.env.example` to `.env` and update the values
3. Run the development server:

```bash
deno task dev
```

The server will start on the configured port (default: 8000).

## API Documentation

Interactive API documentation is available at:
- Development: `http://localhost:8000/api-docs`
- Production: `https://auth-api.notpossiblelabs.com/api-docs`

The raw OpenAPI specification is available at `/api-docs/json`.

## Project Structure

```
auth-api/
├── src/
│   ├── deps.ts            # Centralized dependencies
│   ├── main.ts           # Application entry point
│   ├── lib/              # Shared utilities
│   └── routes/           # API routes
│       ├── health/       # Health check endpoint
│       │   ├── health.api.ts    # OpenAPI spec
│       │   └── health.routes.ts # Route handlers
│       └── tasks/        # Task management endpoints
│           ├── tasks.api.ts     # OpenAPI spec
│           └── tasks.routes.ts  # Route handlers
├── .env                  # Environment variables
└── deno.json            # Deno configuration
```

## Route Structure

Each route module consists of two files:
1. `*.routes.ts` - Contains the Express route handlers and validation logic
2. `*.api.ts` - Contains the OpenAPI specification for the routes

Example route structure:
```typescript
// routes.ts
import { Router } from "npm:express@4";
import { z } from "../../deps.ts";

const router = Router();

router.post("/endpoint", (req, res) => {
  // Route implementation
});

export default router;

// api.ts
import type { OpenAPIPath } from "../../lib/types.ts";

export const apiSpec: OpenAPIPath = {
  "/endpoint": {
    post: {
      // OpenAPI specification
    }
  }
};
```

## Type Safety

The project uses TypeScript with strict type checking:

1. Request/response types are enforced through TypeScript
2. Request bodies are validated using Zod schemas
3. OpenAPI documentation is type-safe through the OpenAPIPath type

## Dependencies

- Deno standard library
- Express.js framework
- Zod for schema validation
- Scalar for API documentation

## Environment Variables

| Variable    | Description           | Default     |
|-------------|--------------------|-------------|
| PORT        | Server port        | 8000        |
| NODE_ENV    | Environment       | development |
| HOST        | Production host   | -           |
| LOG_LEVEL   | Logging level     | debug       |
| DATABASE_URL| Database connection| file:dev.db |
