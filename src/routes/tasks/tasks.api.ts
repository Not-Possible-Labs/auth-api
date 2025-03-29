import type { OpenAPIPath } from "../../lib/types.ts";

export const tasksApiSpec: OpenAPIPath = {
  "/tasks": {
    post: {
      tags: ["Tasks"],
      summary: "Create a new task",
      description: "Creates a new task with the provided details",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  description: "The title of the task"
                },
                description: {
                  type: "string",
                  description: "Detailed description of the task"
                },
                status: {
                  type: "string",
                  enum: ["pending", "in_progress", "completed"],
                  description: "Current status of the task"
                },
                priority: {
                  type: "string",
                  enum: ["low", "medium", "high"],
                  description: "Priority level of the task"
                }
              },
              required: ["title", "status"]
            },
            examples: {
              "Simple Task": {
                value: {
                  title: "Complete project documentation",
                  status: "pending"
                },
                summary: "Minimal task with required fields"
              },
              "Full Task": {
                value: {
                  title: "Write API documentation",
                  description: "Create comprehensive documentation for all API endpoints",
                  status: "in_progress",
                  priority: "high"
                },
                summary: "Task with all fields"
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: "Task created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  status: { type: "string" },
                  priority: { type: "string" },
                  createdAt: { type: "string", format: "date-time" }
                }
              },
              examples: {
                "Created Task": {
                  value: {
                    id: "task_123",
                    title: "Write API documentation",
                    description: "Create comprehensive documentation for all API endpoints",
                    status: "in_progress",
                    priority: "high",
                    createdAt: "2025-03-29T19:02:14Z"
                  },
                  summary: "Example of created task"
                }
              }
            }
          }
        },
        400: {
          description: "Invalid request body",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string" }
                }
              },
              examples: {
                "Missing Title": {
                  value: {
                    error: "Title is required"
                  },
                  summary: "Error when title is missing"
                },
                "Invalid Status": {
                  value: {
                    error: "Valid status is required"
                  },
                  summary: "Error when status is invalid"
                }
              }
            }
          }
        }
      }
    }
  }
};
