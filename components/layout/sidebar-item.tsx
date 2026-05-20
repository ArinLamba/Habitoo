"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Folders, ChartNoAxesColumn } from "lucide-react";

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
      variant={active ? "sidebarOutline" : "sidebar"}
      className={cn(
        "h-10 justify-start gap-x-3",
        active
          ? "text-blue-600 dark:text-blue-400"
          : "text-muted-foreground hover:text-foreground"
      )}
      asChild
    >
      <Link href={href}>
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </Link>
    </Button>
  );
};