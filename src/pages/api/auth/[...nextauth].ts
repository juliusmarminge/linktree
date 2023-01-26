import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, {
  DefaultUser,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    handle: string;
    bgGradient: string;
  }
  interface Session {
    user?: {
      id: string;
      handle: string;
      bgGradient: string;
    } & DefaultSession["user"];
  }
}

const defaultGradient = `linear-gradient(
  25deg,
  hsl(240deg 15% 13%) 0%,
  hsl(233deg 22% 15%) 11%,
  hsl(226deg 30% 17%) 23%,
  hsl(221deg 40% 18%) 36%,
  hsl(215deg 52% 19%) 48%,
  hsl(221deg 62% 26%) 61%,
  hsl(238deg 46% 36%) 74%,
  hsl(264deg 54% 40%) 87%,
  hsl(287deg 84% 36%) 100%
)`;

export const authOpts: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: {
    ...PrismaAdapter(prisma),
    createUser: async (user) => {
      if (!user.name) throw new Error("User name is required");
      const handle = user.name.replace(/[^a-zA-Z0-9]/g, "");
      const bgGradient = defaultGradient;
      const image = user.image ?? "";
      return await prisma.user.create({
        data: { ...user, handle, name: user.name, bgGradient, image },
      });
    },
  },
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.handle = user.handle;
        session.user.bgGradient = user.bgGradient;
      }
      return session;
    },
  },
};

export default NextAuth(authOpts);
