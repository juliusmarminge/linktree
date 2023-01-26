import {
  CreateTRPCClientOptions,
  createTRPCProxyClient,
  httpBatchLink,
  loggerLink,
} from "@trpc/client";
import { AppRouter } from "./router";

export function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:3000`;
}

export const clientOptions: CreateTRPCClientOptions<AppRouter> = {
  links: [
    loggerLink(),
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
};

export const trpc = createTRPCProxyClient(clientOptions);
