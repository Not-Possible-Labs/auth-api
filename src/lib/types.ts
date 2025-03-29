import { z } from "../deps.ts";
import { Context } from "../deps.ts";

export interface OpenAPIRouteConfig<
  T extends z.ZodType,
  P extends z.ZodType = z.ZodType,
  Q extends z.ZodType = z.ZodType,
  B extends z.ZodType = z.ZodType
> {
  path: string;
  method: "get" | "post" | "put" | "delete" | "patch";
  tags?: string[];
  summary?: string;
  description?: string;
  params?: P;
  query?: Q;
  body?: B;
  response: T;
  handler: (ctx: Context) => Promise<void> | void;
}

export interface OpenAPIRoute<
  T extends z.ZodType,
  P extends z.ZodType = z.ZodType,
  Q extends z.ZodType = z.ZodType,
  B extends z.ZodType = z.ZodType
> extends OpenAPIRouteConfig<T, P, Q, B> {
  schema: {
    params?: P;
    query?: Q;
    body?: B;
    response: T;
  };
}

export type OpenAPIPath = {
  get?: OpenAPIOperation;
  post?: OpenAPIOperation;
  put?: OpenAPIOperation;
  delete?: OpenAPIOperation;
  patch?: OpenAPIOperation;
};

export type OpenAPIOperation = {
  tags?: string[];
  summary?: string;
  description?: string;
  parameters?: OpenAPIParameter[];
  requestBody?: OpenAPIRequestBody;
  responses: Record<string, OpenAPIResponse>;
};

export type OpenAPIParameter = {
  name: string;
  in: "path" | "query";
  required?: boolean;
  schema: OpenAPISchema;
};

export type OpenAPIRequestBody = {
  required?: boolean;
  content: {
    "application/json": {
      schema: OpenAPISchema;
    };
  };
};

export type OpenAPIResponse = {
  description: string;
  content?: {
    "application/json": {
      schema: OpenAPISchema;
    };
  };
};

export type OpenAPISchema = {
  type: "object" | "string" | "number" | "boolean" | "array";
  properties?: Record<string, OpenAPISchema>;
  required?: string[];
  items?: OpenAPISchema;
  format?: string;
};

export interface OpenAPIConfig {
  info: {
    title: string;
    version: string;
    description?: string;
  };
  routes: OpenAPIRoute<z.ZodType, z.ZodType, z.ZodType, z.ZodType>[];
}
