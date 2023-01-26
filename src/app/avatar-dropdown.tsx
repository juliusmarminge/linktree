"use client";

import { LogOut, Edit, Activity, LogIn } from "lucide-react";
import { type Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "~/ui/avatar";
import { Button } from "~/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/ui/dropdown";

import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function AvatarDropdown(props: { session: Session | null }) {
  const { session } = props;
  const name = session?.user?.name;
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("");
  const handle = session?.user?.handle;

  const router = useRouter();

  if (!session)
    return (
      <Button
        variant="ghost"
        className="relative h-10 w-10 p-1 rounded-full"
        onClick={() => void signIn()}
      >
        <LogIn />
      </Button>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage
              src={session?.user?.image ?? undefined}
              alt={name ?? undefined}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            <Activity className="mr-2 h-4 w-4" />
            <span>Analytics</span>
            <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`${handle}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit your tree</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
