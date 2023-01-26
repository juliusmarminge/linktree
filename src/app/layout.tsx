import "../styles/globals.css";
import { Inter as FontSans } from "@next/font/google";
import { unstable_getServerSession } from "next-auth";

import { cn } from "~/utils/cn";
import { AvatarDropdown } from "./avatar-dropdown";
import { ReactNode } from "react";
import { authOpts } from "~/pages/api/auth/[...nextauth]";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await unstable_getServerSession(authOpts);

  return (
    <html lang="en" data-theme="dark">
      <head>
        <title>Link Previewer</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta name="description" content="Preview links on hover" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-white font-sans text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-50",
          fontSans.variable
        )}
      >
        <div className="flex min-h-screen flex-col">
          <div className="container px-4 flex-1 mx-auto">
            <div className="flex pt-4 md:pt-8 justify-end items-center">
              <AvatarDropdown session={session} />
            </div>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
