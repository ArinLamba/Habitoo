"use client";

import { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { cn } from "@/lib/utils";

type Props = {
  title: string;
  count: number;
  children: ReactNode;
  defaultOpen?: boolean;
  variant?: "default" | "success";
};

export const HabitSection = ({
  title,
  count,
  children,
  defaultOpen = true,
  variant = "default",
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);

  const isSuccess = variant === "success";

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <section
        className={cn(
          "mb-3 overflow-hidden rounded-md border shadow-sm",
          isSuccess
            ? "border-blue-500/20 bg-blue-500/[0.04]"
            : "border-black/10 bg-white dark:border-white/10 dark:bg-zinc-900"
        )}
      >
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center gap-x-1 border-b px-3 py-2 text-xs font-semibold uppercase tracking-wide",
              isSuccess
                ? "border-blue-500/20 text-blue-600 dark:text-blue-300"
                : "border-black/10 text-muted-foreground dark:border-white/10"
            )}
          >
            <span>{title}</span>
            <span>({count})</span>

            <ChevronDown
              size={18}
              className={cn(
                "ml-auto transition-transform",
                open && "rotate-180"
              )}
            />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>{children}</CollapsibleContent>
      </section>
    </Collapsible>
  );
};
