import { LinkCard } from "./link-card";
import { socialProviders } from "~/utils/socials";
import { buttonVariants } from "~/ui/button";
import { trpc } from "~/server/api";

type PageParams = { params: { name: string } };
export default async function HomePage({ params }: PageParams) {
  const { user, tree } = await trpc.tree.byHandle.query(params.name);

  return (
    <div className="flex items-center flex-col mx-auto w-full justify-center pt-16 max-w-3xl">
      <div className="flex justify-center relative w-full">
        <img
          className="rounded-full"
          alt={user.name}
          src={user.image}
          width={96}
          height={96}
        />
      </div>
      <h1 className="font-bold mt-4 mb-8 text-xl">{user.name}</h1>
      <div className="flex flex-col gap-4 w-full">
        {tree.links.map((link) => (
          <LinkCard key={link.href} {...link} />
        ))}
      </div>
      <div className="flex items-center gap-4 mt-8">
        {tree.socials.map((social) => (
          <a
            aria-label={`${social.provider} link`}
            className={buttonVariants({ variant: "ghost" })}
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
