import { CalendarDays, GithubIcon, TwitterIcon } from "lucide-react";
import Image from "next/image";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/ui/hover-card";
import { LinkCard } from "./link-card";
import { Data, Link } from "./types";

export const runtime = "edge";

export default async function HomePage() {
  const data: Data = {
    name: "Julius Marminge",
    avatar: "https://github.com/juliusmarminge.png",
    links: [
      { href: "https://jumr.dev", title: "Personal Website" },
      { href: "https://jumr.dev/blog", title: "Blog" },
      { href: "https://cal.com/juliusm", title: "Cal.com - Book a call" },
    ],
    socials: [
      { href: "https://twitter.com/jullerino", title: "Twitter" },
      { href: "https://github.com/juliusmarminge", title: "GitHub" },
    ],
  };

  return (
    <div className="flex items-center flex-col mx-auto w-full justify-center pt-16 px-8">
      <Image
        priority
        className="rounded-full"
        alt={data.name}
        src={data.avatar}
        width={96}
        height={96}
      />
      <h1 className="font-bold mt-4 mb-8 text-xl text-white">{data.name}</h1>
      <div className="flex flex-col gap-4 w-full max-w-3xl">
        {data.links.map((link) => (
          <LinkCard key={link.href} {...link} />
        ))}
      </div>
      <div className="flex items-center gap-4 mt-8 text-white">
        {data.socials.map((social) => (
          <a
            aria-label={`${social.title} link`}
            className=" p-2 rounded-md bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-100 dark:hover:text-slate-100 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent"
            key={social.href}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {social.href.includes("twitter") ? (
              <TwitterIcon />
            ) : social.href.includes("github") ? (
              <GithubIcon />
            ) : null}
          </a>
        ))}
      </div>
    </div>
  );
}
