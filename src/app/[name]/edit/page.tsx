"use client";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/ui/dialog";
import {
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Edit,
  Palette,
  CheckIcon,
} from "lucide-react";

import { cache, use, useState } from "react";
import { socialProviders, type SocialProvider } from "~/utils/socials";
import NextLink from "next/link";
import { Button } from "~/ui/button";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { cn } from "~/utils/cn";
import { Input } from "~/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/ui/dropdown";
import { Textarea } from "~/ui/text-area";
import { trpc, type RouterOutputs } from "~/server/api";
import { useRouter } from "next/navigation";

type Link = RouterOutputs["tree"]["byHandle"]["tree"]["links"][number];
type Social = RouterOutputs["tree"]["byHandle"]["tree"]["socials"][number];

const treeQuery = cache((name: string) => trpc.tree.byHandle.query(name));

export default function HomePage({ params }: { params: { name: string } }) {
  const { tree: serverTree, user: serverUser } = use(treeQuery(params.name));
  const [tree, setTree] = useState(serverTree);
  const [user, setUser] = useState(serverUser);

  const router = useRouter();

  const [editBgGradient, setEditBgGradient] = useState(user.bgGradient);
  const [editProfilePic, setEditProfilePic] = useState(user.image);
  const [editDisplayName, setEditDisplayName] = useState(user.name);
  const [editLinkLabel, setEditLinkLabel] = useState("");
  const [editLinkHref, setEditLinkHref] = useState("");
  const [editSocialProvider, setEditSocialProvider] = useState<
    SocialProvider | undefined
  >();
  const [editSocialHref, setEditSocialHref] = useState("");

  const selectLink = (link: Link) => {
    setEditLinkLabel(link.label);
    setEditLinkHref(link.href);
  };

  const selectSocial = (social: Social) => {
    setEditSocialProvider(social.provider);
    setEditSocialHref(social.href);
  };

  const saveLink = (index: number) => {
    const newLinks = [...tree.links];
    newLinks[index] = {
      ...newLinks[index],
      label: editLinkLabel,
    };
    setTree({ ...tree, links: newLinks });
  };

  const moveLink = async (index: number, increment: 1 | -1) => {
    const newLinks = [...tree.links];
    const link = tree.links[index];
    const tmp = newLinks[index + increment];
    if (tmp) {
      newLinks[index] = tmp;
      newLinks[index + increment] = link;
    }
    setTree({ ...tree, links: newLinks });
  };

  const saveBgGradient = () => {
    /* Remove `background-image:` if there is, as well as a trailing `;` */
    const parsed = editBgGradient
      .replace("background-image:", "")
      .replace(";", "");
    document.body.style.setProperty("--bg-gradient", parsed);
    setUser({ ...user, bgGradient: parsed });
  };

  const saveImg = () => {
    setUser({ ...user, image: editProfilePic });
  };

  const saveDisplayName = () => {
    setUser({ ...user, name: editDisplayName });
  };

  const saveSocial = (index: number) => {
    const newSocials = [...tree.socials];
    newSocials[index] = {
      ...newSocials[index],
      provider: editSocialProvider!,
      href: editSocialHref,
    };

    setTree({ ...tree, socials: newSocials });
  };

  const storeTree = async () => {
    await toast.promise(
      Promise.all([
        trpc.tree.update.mutate(tree),
        trpc.user.update.mutate(user),
      ]),
      {
        pending: "Saving all changes...",
        success: "Saved all changes!",
        error: "Failed to save changes",
      }
    );
    router.push(`/${params.name}`);
  };

  const [parent] = useAutoAnimate<HTMLDivElement>();

  return (
    <div className="flex items-center flex-col mx-auto w-full justify-center pt-16 max-w-3xl">
      {/* START EDIT BACKGROUND GRADIENT */}
      <Dialog>
        <DialogTrigger asChild className="absolute">
          <Button
            variant="ghost"
            className="h-14 w-14 p-2 rounded-full translate-x-28 sm:translate-x-36 md:translate-x-52 -translate-y-40"
          >
            <Palette className="h-12 w-12 rounded-full text-clip" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Background Gradient</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Generate a gradient from{" "}
            <NextLink
              href="https://www.joshwcomeau.com/gradient-generator/"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              here
            </NextLink>
            , then paste the generated CSS here.
          </DialogDescription>
          <div className="flex flex-col gap-4 py-4">
            <Textarea
              placeholder="linear-gradient(25deg, hsl(240deg 15% 13%) 0%, hsl(264deg 54% 40%) 87%, hsl(287deg 84% 36%) 100%)"
              value={editBgGradient}
              onChange={(e) => setEditBgGradient(e.currentTarget.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" onClick={() => saveBgGradient()}>
                Save changes
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* END EDIT BACKGROUND GRADIENT */}

      <Button
        variant="outline"
        onClick={() => storeTree()}
        className="absolute p-2 dark:border-green-500 translate-x-28 sm:translate-x-36 md:translate-x-52 -translate-y-24"
      >
        Save changes <CheckIcon className="h-6 w-6 text-green-500" />
      </Button>

      {/* START EDIT PROFILE PIC */}
      <Dialog>
        <DialogTrigger asChild>
          <button className="relative w-24 h-24 group">
            <img
              className="rounded-full absolute top-1/2 -translate-y-1/2"
              alt={user.name}
              src={user.image}
              width={96}
              height={96}
            />
            <ImageIcon className="h-24 w-24 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 invisible group-hover:visible bg-slate-700/40 p-4 rounded-full" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Input
              placeholder="Link title"
              value={editProfilePic}
              onChange={(e) => setEditProfilePic(e.currentTarget.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" onClick={() => saveImg()}>
                Save changes
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* END EDIT PROFILE PIC */}

      {/* START EDIT NAME */}
      <Dialog>
        <DialogTrigger asChild>
          <h1 className="font-bold mt-4 mb-8 text-xl text-white hover:text-slate-300 relative group">
            {user.name}
            <Edit className="absolute right-0 top-0 translate-x-4 -translate-y-2 h-4 invisible group-hover:visible" />
          </h1>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Display Name</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Input
              placeholder="Link title"
              value={editDisplayName}
              onChange={(e) => setEditDisplayName(e.currentTarget.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" onClick={() => saveDisplayName()}>
                Save changes
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* END EDIT NAME */}

      {/* START EDIT LINKS */}
      <div ref={parent} className="flex flex-col gap-4 w-full">
        {tree.links.map((link, index) => (
          <Dialog key={link.href}>
            <DialogTrigger asChild>
              <div
                className="relative group flex items-center text-center w-full p-1 text-slate-800 bg-slate-300 hover:bg-slate-300/90 rounded-md cursor-pointer"
                onClick={() => selectLink(link)}
              >
                <h2 className="flex justify-center items-center font-semibold w-full h-10">
                  {link.label}
                </h2>
                {index !== 0 && (
                  <Button
                    className={cn(
                      "invisible group-hover:visible absolute left-[-10px] top-1 h-5 w-5 p-0 z-50",
                      index !== tree.links.length - 1 && "rounded-b-none"
                    )}
                    onClick={() => moveLink(index, -1)}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                )}
                {index !== tree.links.length - 1 && (
                  <Button
                    className={cn(
                      "invisible group-hover:visible absolute left-[-10px] bottom-1 h-5 w-5 p-0 z-50",
                      index !== 0 && "rounded-t-none"
                    )}
                    onClick={() => moveLink(index, 1)}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Link</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <Input
                  placeholder="Link title"
                  value={editLinkLabel}
                  onChange={(e) => setEditLinkLabel(e.currentTarget.value)}
                />
                <Input
                  placeholder="Link href"
                  value={editLinkHref}
                  onChange={(e) => setEditLinkHref(e.target.value)}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit" onClick={() => saveLink(index)}>
                    Save changes
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ))}
      </div>
      {/* END EDIT LINKS */}

      {/* START EDIT SOCIALS */}
      <div className="flex items-center gap-4 mt-8 text-white">
        {tree.socials.map((social, index) => (
          <Dialog key={social.href}>
            <DialogTrigger asChild>
              <button
                aria-label={`${social.provider} link`}
                className=" p-2 rounded-md bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-100 dark:hover:text-slate-100 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent"
                key={social.href}
                onClick={() => selectSocial(social)}
              >
                {socialProviders[social.provider]}
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Social Link</DialogTitle>
              </DialogHeader>
              <div className="flex flex-1 gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="col-span-1">
                      {socialProviders[editSocialProvider!]}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-40"
                    align="start"
                    forceMount
                  >
                    <DropdownMenuRadioGroup
                      value={editSocialProvider}
                      onValueChange={(value) =>
                        setEditSocialProvider(value as any)
                      }
                    >
                      {Object.entries(socialProviders).map(
                        ([provider, Icon]) => (
                          <DropdownMenuRadioItem
                            key={provider}
                            value={provider}
                          >
                            <div className="flex items-center gap-2">
                              {Icon}
                              <span>{provider}</span>
                            </div>
                          </DropdownMenuRadioItem>
                        )
                      )}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Input
                  placeholder="Link title"
                  value={editSocialHref}
                  onChange={(e) => setEditSocialHref(e.currentTarget.value)}
                  className="col-span-3"
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit" onClick={() => saveSocial(index)}>
                    Save changes
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ))}
      </div>
      {/* END EDIT SOCIALS */}
      <ToastContainer />
    </div>
  );
}
