import { SocialProvider } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, createTRPCRouter, protectedProcedure } from "./trpc";

export const appRouter = createTRPCRouter({
  tree: createTRPCRouter({
    byHandle: publicProcedure
      .input(z.string())
      .query(async ({ ctx, input }) => {
        const userWithTree = await ctx.prisma.user.findUniqueOrThrow({
          where: { handle: input },
          include: {
            tree: {
              include: {
                links: true,
                socials: true,
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

    update: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          links: z.array(
            z.object({
              id: z.string().optional(),
              label: z.string(),
              href: z.string(),
            })
          ),
          socials: z.array(
            z.object({
              id: z.string().optional(),
              provider: z.nativeEnum(SocialProvider),
              href: z.string(),
            })
          ),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, links, socials } = input;
        const tree = await ctx.prisma.tree.update({
          where: { id },
          data: {
            links: {
              upsert: links.map((link) => ({
                where: { id: link.id },
                create: link,
                update: link,
              })),
            },
            socials: {
              upsert: socials.map((social) => ({
                where: { id: social.id },
                create: social,
                update: social,
              })),
            },
          },
        });
        return tree;
      }),
  }),

  user: createTRPCRouter({
    update: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          bgGradient: z.string().optional(),
          image: z.string().optional(),
          name: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const user = await ctx.prisma.user.update({
          where: { id },
          data,
        });
        return user;
      }),
  }),
});

export type AppRouter = typeof appRouter;
