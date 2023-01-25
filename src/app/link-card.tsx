"use client";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/ui/hover-card";
import { useState } from "react";
import { Link } from "./types";
import Image from "next/image";
import { CalendarDays } from "lucide-react";

export function LinkCard({ href, title }: Link) {
  const [image, setImage] = useState<string | null>();
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center p-1 w-full rounded-md hover:scale-105 transition-all bg-slate-300 max-w-3xl"
        >
          <div className="flex text-center w-full">
            <div className="w-10 h-10">
              {image && (
                <Image
                  className="rounded-sm"
                  alt={title}
                  src={image}
                  width={40}
                  height={40}
                />
              )}
            </div>
            <h2 className="flex justify-center items-center font-semibold w-full text-gray-700 -ml-10">
              {title}
            </h2>
          </div>
        </a>
      </HoverCardTrigger>
      <HoverCardContent className="w-96">
        <div className="flex justify-between space-x-4">
          <Image
            src="https://github.com/juliusmarminge.png"
            height={40}
            width={40}
            alt="Julius Marminge"
          />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">
              The React Framework - created and maintained by @vercel.
            </p>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
