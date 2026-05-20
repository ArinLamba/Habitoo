"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartNoAxesColumn, Folders } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ICONS = {
  Folders,
  ChartNoAxesColumn,
};

type IconName = keyof typeof ICONS;

type Props = {
  label: string;
  icon: IconName;
  href: string;
};

export const SidebarItem = ({ label, icon, href }: Props) => {
  const pathname = usePathname();
  const active = pathname === href;

  const Icon = ICONS[icon];

  return (
    <Button
      variant="ghost"
      className={cn(
        "h-10 justify-start gap-x-3 rounded-md px-3 text-sm",
        active
          ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 shadow-sm hover:bg-emerald-500/15 dark:text-emerald-300"
          : "text-muted-foreground hover:bg-zinc-100 hover:text-foreground dark:hover:bg-white/5"
      )}
      asChild
    >
      <Link href={href}>
        <Icon className={cn(
          "h-4 w-4",
          active && "text-emerald-500"
        )} />
        <span>{label}</span>
      </Link>
    </Button>
  );
};
