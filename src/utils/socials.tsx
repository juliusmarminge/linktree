import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import { type SocialProvider } from "@prisma/client";

export const socialProviders: Record<SocialProvider, JSX.Element> = {
  Facebook: <Facebook />,
  GitHub: <Github />,
  LinkedIn: <Linkedin />,
  Instagram: <Instagram />,
  Twitter: <Twitter />,
  YouTube: <Youtube />,
};
export { type SocialProvider };
