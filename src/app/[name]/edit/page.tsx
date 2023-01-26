"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/ui/dialog";
import { Image as ImageIcon, ArrowUp, ArrowDown, Edit } from "lucide-react";

import { useState } from "react";
import { Link, Social, SocialProvider, socialProviders, trees } from "~/data";
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

interface PageProps {
  params: { name: string };
}

export default function HomePage({ params }: PageProps) {
  const [parent] = useAutoAnimate<HTMLDivElement>();
  const [tree, setTree] = useState(trees.get(params.name));
  if (!tree) throw new Error("User not found");

  const moveLink = (index: number, increment: 1 | -1) => {
    const newLinks = [...tree.links];
    const link = tree.links[index];
    const tmp = newLinks[index + increment];
    if (tmp) {
      newLinks[index] = tmp;
      newLinks[index + increment] = link;
    }
    setTree({ ...tree, links: newLinks });
  };

  const [editProfilePic, setEditProfilePic] = useState(tree.avatar);
  const [editDisplayName, setEditDisplayName] = useState(tree.name);
  const [editLinkTitle, setEditLinkTitle] = useState("");
  const [editLinkHref, setEditLinkHref] = useState("");
  const [editSocialProvider, setEditSocialProvider] = useState<
    SocialProvider | undefined
  >();
  const [editSocialHref, setEditSocialHref] = useState("");

  const selectLink = (link: Link) => {
    setEditLinkTitle(link.title);
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
      title: editLinkTitle,
    };
    setTree({ ...tree, links: newLinks });
  };

  const saveImg = () => {
    setTree({ ...tree, avatar: editProfilePic });
  };

  const saveDisplayName = () => {
    setTree({ ...tree, name: editDisplayName });
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

  return (
    <div className="flex items-center flex-col mx-auto w-full justify-center pt-16 max-w-3xl">
      <div className="flex justify-center relative w-full">
        <div className="flex justify-center relative">
          {/* START EDIT PROFILE PIC */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="relative w-24 h-24 group">
                <img
                  className="rounded-full absolute top-1/2 -translate-y-1/2"
                  alt={tree.name}
                  src={tree.avatar}
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
        </div>
      </div>

      {/* START EDIT NAME */}
      <Dialog>
        <DialogTrigger asChild>
          <h1 className="font-bold mt-4 mb-8 text-xl text-white hover:text-slate-300 relative group">
            {tree.name}
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

      <div ref={parent} className="flex flex-col gap-4 w-full">
        {tree.links.map((link, index) => (
          <Dialog key={link.href}>
            <DialogTrigger asChild>
              <div
                className="relative group flex items-center text-center w-full p-1 text-slate-800 bg-slate-300 hover:bg-slate-300/90 rounded-md cursor-pointer"
                onClick={() => selectLink(link)}
              >
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
                <h2 className="flex justify-center items-center font-semibold w-full h-10">
                  {link.title}
                </h2>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Link</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <Input
                  placeholder="Link title"
                  value={editLinkTitle}
                  onChange={(e) => setEditLinkTitle(e.currentTarget.value)}
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
    </div>
  );
}
