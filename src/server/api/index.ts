import type { AppRouter } from "./router";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

/**
 * This will be exported from either client.ts or rsc.ts depending on the environment
 */
export { trpc } from "./client";
