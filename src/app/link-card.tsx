"use client";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/ui/hover-card";
import { Link } from "./types";
import Image from "next/image";
import { useState } from "react";
import { previewImageParams } from "~/utils/zod-params";
import { cn } from "~/utils/cn";

export function LinkCard({ href, title }: Link) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  function fetchImg() {
    if (imageUrl) return;
    setIsLoading(true);
    const params = previewImageParams.toSearchString({ url: href });
    fetch(`/api/preview-image?${params}`)
      .then((res) => res.blob())
      .then((blog) => {
        const url = URL.createObjectURL(blog);
        setImageUrl(url);
        setIsLoading(false);
      });
  }

  return (
    <HoverCard onOpenChange={fetchImg} openDelay={300} closeDelay={200}>
      <HoverCardTrigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center p-1 w-full rounded-md hover:scale-105 transition-all bg-slate-300 max-w-3xl"
        >
          <div className="flex text-center w-full">
            <h2 className="flex justify-center items-center font-semibold w-full text-slate-800 h-10">
              {title}
            </h2>
          </div>
        </a>
      </HoverCardTrigger>
      <HoverCardContent className="w-96">
        <div
          className={cn(
            "flex relative justify-center items-center aspect-video rounded-lg",
            isLoading && "animate-pulse bg-slate-300 dark:bg-slate-800"
          )}
        >
          {isLoading ? (
            <svg
              className="w-12 h-12 text-slate-300"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 640 512"
            >
              <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
            </svg>
          ) : imageUrl === null ? (
            <svg
              className="w-12 h-12 text-slate-300"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 640 512"
            ></svg>
          ) : (
            <Image
              src={imageUrl}
              height={720}
              width={1280}
              alt="Julius Marminge"
            />
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
