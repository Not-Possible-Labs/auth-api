import { Context } from "hono";

export interface Route {
  method: keyof OpenAPIPath[string];
  path: string;
  handler: (c: Context) => Response | Promise<Response>;
}

// OpenAPI types
export type OpenAPIPath = {
  [path: string]: {
    get?: OpenAPIOperation;
    post?: OpenAPIOperation;
    put?: OpenAPIOperation;
    delete?: OpenAPIOperation;
    patch?: OpenAPIOperation;
  };
};

export type OpenAPIOperation = {
  tags: string[];
  summary: string;
  description?: string;
  requestBody?: {
    required?: boolean;
    content: {
      [contentType: string]: {
        schema: OpenAPISchema;
        examples?: {
          [name: string]: {
            value: unknown;
            summary?: string;
          };
        };
      };
    };
  };
  responses: {
    [statusCode: string]: {
      description: string;
      content?: {
        [contentType: string]: {
          schema: OpenAPISchema;
          examples?: {
            [name: string]: {
              value: unknown;
              summary?: string;
            };
          };
        };
      };
    };
  };
};

export type OpenAPISchema = {
  type: string;
  properties?: Record<string, OpenAPISchemaProperty>;
  required?: string[];
  items?: OpenAPISchema;
  enum?: string[];
  nullable?: boolean;
  format?: string;
};

export type OpenAPISchemaProperty = {
  type: string;
  description?: string;
  example?: unknown;
  enum?: string[];
  nullable?: boolean;
  format?: string;
  items?: OpenAPISchema;
};
