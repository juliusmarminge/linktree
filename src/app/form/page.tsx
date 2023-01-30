"use client";

import { z } from "zod";
import { useForm, UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/ui/input";
import { Button } from "~/ui/button";

function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
    schema: TSchema;
  }
) {
  const form = useForm<TSchema["_input"]>({
    ...props,
    resolver: zodResolver(props.schema, undefined),
  });

  return form;
}

const schema = z.object({
  name: z.string().min(3).max(20),
  email: z.string().email(),
});

export default function FormTest() {
  const methods = useZodForm({
    schema,
    defaultValues: {
      name: "",
      email: "",
    },
  });

  return (
    <form action="" className="flex flex-col gap-2 max-w-2xl py-16 mx-auto">
      <Input {...methods.register("name")} className="bg-slate-600/60" />
      <Input {...methods.register("email")} className="bg-slate-600/60" />
      <Button type="submit">Submit</Button>
    </form>
  );
}
