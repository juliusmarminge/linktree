import { createNextApiHandler } from "@trpc/server/adapters/next";
import { createTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/router";

export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
});
