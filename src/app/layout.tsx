import "./globals.css";
import { Inter as FontSans } from "@next/font/google";
import { unstable_getServerSession } from "next-auth";

import { cn } from "~/utils/cn";
import { AvatarDropdown } from "./avatar-dropdown";
import { ReactNode } from "react";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await unstable_getServerSession();

  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head />
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
