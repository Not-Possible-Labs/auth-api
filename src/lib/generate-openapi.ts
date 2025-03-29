import { z } from "../deps.ts";
import { OpenAPIConfig, OpenAPIPath, OpenAPISchema, OpenAPIParameter } from "./types.ts";

export function generateOpenAPI(config: OpenAPIConfig) {
  const paths: Record<string, OpenAPIPath> = {};

  for (const route of config.routes) {
    if (!paths[route.path]) {
      paths[route.path] = {};
    }

    paths[route.path][route.method] = {
      tags: route.tags,
      summary: route.summary,
      description: route.description,
      parameters: [
        ...(route.params
          ? Object.entries(route.params instanceof z.ZodObject ? route.params.shape : {}).map(([name]): OpenAPIParameter => ({
              name,
              in: "path",
              required: true,
              schema: zodToJsonSchema(route.params instanceof z.ZodObject ? route.params.shape[name] as z.ZodType : z.string()),
            }))
          : []),
        ...(route.query
          ? Object.entries(route.query instanceof z.ZodObject ? route.query.shape : {}).map(([name]): OpenAPIParameter => ({
              name,
              in: "query",
              schema: zodToJsonSchema(route.query instanceof z.ZodObject ? route.query.shape[name] as z.ZodType : z.string()),
            }))
          : []),
      ],
      ...(route.body && {
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: zodToJsonSchema(route.body),
            },
          },
        },
      }),
      responses: {
        "200": {
          description: "Successful response",
          content: {
            "application/json": {
              schema: zodToJsonSchema(route.response),
            },
          },
        },
      },
    };
  }

  return {
    openapi: "3.0.0",
    info: config.info,
    paths,
  };
}

function zodToJsonSchema(schema: z.ZodType): OpenAPISchema {
  if (!schema) return { type: "object" };
  
  if (schema instanceof z.ZodObject) {
    const properties: Record<string, OpenAPISchema> = {};
    const required: string[] = [];

    Object.entries(schema.shape).forEach(([key, value]) => {
      if (value instanceof z.ZodType) {
        properties[key] = zodToJsonSchema(value);
        if (!value.isOptional()) {
          required.push(key);
        }
      }
    });

    return {
      type: "object",
      properties,
      ...(required.length > 0 ? { required } : {}),
    };
  }

  if (schema instanceof z.ZodString) {
    const checks = (schema._def.checks || []) as Array<{ kind: string }>;
    return {
      type: "string",
      ...(checks.reduce((acc: { format?: string }, check) => {
        if (check.kind === "email") acc.format = "email";
        if (check.kind === "datetime") acc.format = "date-time";
        return acc;
      }, {})),
    };
  }

  if (schema instanceof z.ZodNumber) {
    return { type: "number" };
  }

  if (schema instanceof z.ZodBoolean) {
    return { type: "boolean" };
  }

  if (schema instanceof z.ZodArray) {
    return {
      type: "array",
      items: zodToJsonSchema(schema.element),
    };
  }

  return { type: "string" };
}
