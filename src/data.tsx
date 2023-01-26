import { Facebook, Github, Linkedin, Twitter } from "lucide-react";

export const socialProviders = {
  Twitter: <Twitter />,
  Github: <Github />,
  Facebook: <Facebook />,
  LinkedIn: <Linkedin />,
};
export type SocialProvider = keyof typeof socialProviders;
export const getSocialIcon = (href: string) => {
  if (href.includes("twitter.com")) return socialProviders.Twitter;
  if (href.includes("github.com")) return socialProviders.Github;
  if (href.includes("facebook.com")) return socialProviders.Facebook;
  if (href.includes("linkedin.com")) return socialProviders.LinkedIn;
  return null;
};

export interface Tree {
  name: string;
  avatar: string;
  gradient: { direction: `${number}deg`; steps: string[] };
  links: Link[];
  socials: Social[];
}

export interface Link {
  href: string;
  title: string;
}

export interface Social {
  provider: SocialProvider;
  href: string;
}

export const trees = new Map<string, Tree>([
  [
    "julius",
    {
      name: "Julius Marminge",
      avatar: "https://github.com/juliusmarminge.png",
      gradient: { direction: "25deg", steps: [] },
      links: [
        { href: "https://jumr.dev", title: "Personal Website" },
        { href: "https://jumr.dev/blog", title: "My Blog" },
        { href: "https://cal.com/juliusm", title: "Cal.com - Book a call" },
      ],
      socials: [
        { href: "https://twitter.com/jullerino", provider: "Twitter" },
        { href: "https://github.com/juliusmarminge", provider: "Github" },
        {
          href: "https://www.linkedin.com/in/julius-marminge-b9a12a241/",
          provider: "LinkedIn",
        },
      ],
    },
  ],
  [
    "theo",
    {
      name: "Theo Browne",
      avatar: "https://github.com/t3dotgg.png",
      gradient: { direction: "25deg", steps: [] },
      links: [
        { href: "https://t3.gg", title: "Personal Website" },
        { href: "https://t3.gg/blog", title: "My Blog" },
        { href: "https://create.t3.gg", title: "Create T3 App" },
        { href: "https://ping.gg", title: "Ping.gg - Stream with friends!" },
      ],
      socials: [
        { href: "https://twitter.com/t3dotgg", provider: "Twitter" },
        { href: "https://github.com/t3dotgg", provider: "Github" },
      ],
    },
  ],
]);
