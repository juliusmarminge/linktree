import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  tree: createTRPCRouter({
    byHandle: publicProcedure
      .input(z.string())
      .query(async ({ ctx, input }) => {
        const userWithTree = await ctx.prisma.user.findUniqueOrThrow({
          where: { handle: input },
          select: {
            id: true,
            handle: true,
            name: true,
            image: true,
            tree: {
              include: {
                links: { select: { id: true, label: true, href: true } },
                socials: { select: { id: true, provider: true, href: true } },
              },
            },
          },
        });
        const { tree, ...user } = userWithTree;
        if (!tree)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Tree for handle ${input} does not exist...`,
          });
        return { user, tree };
      }),
  }),
});

export type AppRouter = typeof appRouter;
