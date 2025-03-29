import { z } from "../deps.ts";
import { OpenAPIRoute, OpenAPIRouteConfig } from "./types.ts";

export function createRoute<
  T extends z.ZodType,
  P extends z.ZodType = z.ZodType,
  Q extends z.ZodType = z.ZodType,
  B extends z.ZodType = z.ZodType
>(config: OpenAPIRouteConfig<T, P, Q, B>): OpenAPIRoute<T, P, Q, B> {
  return {
    ...config,
    schema: {
      params: config.params,
      query: config.query,
      body: config.body,
      response: config.response,
    },
  };
}
