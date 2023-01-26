"use client";

import { Button } from "~/ui/button";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="flex items-center flex-col mx-auto w-full justify-center pt-16 px-8">
      <h1 className="font-bold mt-4 mb-8 text-2xl text-white">
        The user you're looking for does not exist. Claim it for yourself!
      </h1>

      <Button>Claim now!</Button>
    </div>
  );
}
