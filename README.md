# Auth API

A simple REST API built with Deno and Express.

## Architecture

```mermaid
graph TD;
    A[Client Apps] -->|Communicates with| B[Auth Server];
    B -->|Uses| C[Prisma ORM];
    C -->|Connects to| D[Postgres Database];
    A -->|Includes| E[admin-ui];
    A -->|Includes| F[platform-ui];
    B -->|Implements| G[better-auth];
```

The architecture diagram above illustrates the flow of communication and the components involved in the authentication system:
- **Client Apps**: Consists of `admin-ui` and `platform-ui` that interact with the Auth Server.
- **Auth Server**: Implements `better-auth` for authentication and authorization.
- **Prisma ORM**: Used by the Auth Server to interact with the Postgres Database.
- **Postgres Database**: Stores user data and authentication information.

## Features

- Express-based REST API
- TypeScript with strict type checking
- Zod schema validation
- OpenAPI documentation with Scalar
- Environment configuration
- Health check endpoint
- Task management endpoints with pagination

## Getting Started

### Prerequisites

- [Deno](https://deno.land/) installed on your machine
- Git for version control

### Installation

1. Clone the repository
2. Copy `.env.example` to `.env` and update the values
3. Run the dev server:

```bash
deno task dev
```

The server will start on the configured port (default: 8000).

## API Documentation

Interactive API documentation is available at:
- dev: `http://localhost:8000/api-docs`
- Production: `https://auth-api.notpossiblelabs.com/api-docs`

The raw OpenAPI specification is available at `/api-docs/json`.

## Project Structure

```
auth-api/
├── src/
│   ├── deps.ts            # Centralized dependencies
│   ├── main.ts           # Application entry point
│   ├── lib/              # Shared utilities
│   │   └── types.ts      # Shared TypeScript types
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

### Route Naming Convention

API routes follow a consistent naming pattern:
```typescript
// api.ts
const {Resource}{Method}Route: OpenAPIPath = {
  "/resource": {
    method: {
      // OpenAPI specification
    }
  }
};

// Example:
const TasksGetRoute: OpenAPIPath = {
  "/tasks": {
    get: {
      // OpenAPI specification for GET /tasks
    }
  }
};

const TasksPostRoute: OpenAPIPath = {
  "/tasks": {
    post: {
      // OpenAPI specification for POST /tasks
    }
  }
};
```

### Route Implementation Example
```typescript
// routes.ts
import { Router } from "npm:express@4";
import { z } from "../../deps.ts";

const router = Router();

router.get("/tasks", (req: Request<{}, {}, {}, PaginationParams>, res: Response) => {
  // Route implementation with typed request/response
});

export const tasksRouter = router;
```

## Type Safety

The project uses TypeScript with strict type checking:

1. Request/response types are enforced through TypeScript
2. Request bodies are validated using Zod schemas
3. OpenAPI documentation is type-safe through the OpenAPIPath type
4. Pagination parameters and responses are fully typed

## Dependencies

- Deno standard library
- Express.js framework
- Zod for schema validation
- Scalar for API documentation

## Environment Variables

| Variable    | Description        | Default     |
|-------------|--------------------|-------------|
| PORT        | Server port        | 8000        |
| NODE_ENV    | Environment        | dev |
| HOST        | Production host    | -           |
| LOG_LEVEL   | Logging level      | debug       |
| DATABASE_URL| Database connection| file:dev.db |

## Best Practices

### Pagination

#### Page-Based Pagination
All list endpoints should implement page-based pagination using `page` and `limit` query parameters:

```http
GET /api/tasks?page=2&limit=20
```

Parameters:
- `page` (default: 1): The page number to retrieve
- `limit` (default: 10, max: 100): Number of items per page

#### Pagination Response Format
Responses include both the data array and pagination metadata:

```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Example Task",
      "description": "Task description",
      "status": "pending",
      "priority": "high",
      "createdAt": "2024-03-29T10:00:00Z"
    }
  ],
  "pagination": {
    "total_records": 100,
    "current_page": 1,
    "total_pages": 10,
    "next_page": 2,
    "prev_page": null,
    "has_more": true
  }
}
```

The pagination metadata helps clients to:
- Track their position in the dataset
- Calculate the total number of requests needed
- Navigate between pages efficiently
- Determine if more data is available

#### Implementation Example
```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total_records: number;
    current_page: number;
    total_pages: number;
    next_page: number | null;
    prev_page: number | null;
    has_more: boolean;
  };
}

router.get("/tasks", (req: Request<{}, {}, {}, PaginationParams>, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  
  // Calculate pagination metadata
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const totalRecords = tasks.length;
  const totalPages = Math.ceil(totalRecords / limit);
  
  const response: PaginatedResponse<Task> = {
    data: tasks.slice(startIndex, endIndex),
    pagination: {
      total_records: totalRecords,
      current_page: page,
      total_pages: totalPages,
      next_page: page < totalPages ? page + 1 : null,
      prev_page: page > 1 ? page - 1 : null,
      has_more: page < totalPages
    }
  };
  
  res.json(response);
});
```


