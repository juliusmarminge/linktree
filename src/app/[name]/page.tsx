import Image from "next/image";
import { LinkCard } from "./link-card";
import { socialProviders, trees } from "~/data";

export default function HomePage({ params }: { params: { name: string } }) {
  const tree = trees.get(params.name);
  if (!tree) throw new Error("User not found");

  return (
    <div className="flex items-center flex-col mx-auto w-full justify-center pt-16 max-w-3xl">
      <div className="flex justify-center relative w-full">
        <Image
          priority
          className="rounded-full"
          alt={tree.name}
          src={tree.avatar}
          width={96}
          height={96}
        />
      </div>
      <h1 className="font-bold mt-4 mb-8 text-xl text-white">{tree.name}</h1>
      <div className="flex flex-col gap-4 w-full">
        {tree.links.map((link) => (
          <LinkCard key={link.href} {...link} />
        ))}
      </div>
      <div className="flex items-center gap-4 mt-8 text-white">
        {tree.socials.map((social) => (
          <a
            aria-label={`${social.provider} link`}
            className=" p-2 rounded-md bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-100 dark:hover:text-slate-100 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent"
            key={social.href}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {socialProviders[social.provider]}
          </a>
        ))}
      </div>
    </div>
  );
}
