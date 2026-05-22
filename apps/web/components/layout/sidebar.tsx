
import Link from "next/link";
import Image from "next/image";
import { BarChart3, CalendarCheck2 } from "lucide-react";


import { cn } from "@/lib/utils";
import { SidebarItem } from "./sidebar-item";
import { ModeToggle } from "../mode-toggle";

type Props = {
  className?:  string;
};

export const Sidebar = ({ className }: Props) => {

  // const { isSignedIn } = useAuth();

  return (
    <aside className={cn(
      "flex w-[240px] flex-col border-r border-black/10 bg-white/95 px-3 py-3 shadow-sm backdrop-blur md:fixed md:left-0 dark:border-white/10 dark:bg-zinc-950/95",
    className,
    )}>

      <Link href="/habits" className="group">
        <div className="mb-4 rounded-md border border-black/10 bg-zinc-50 p-3 transition-colors group-hover:bg-zinc-100 dark:border-white/10 dark:bg-zinc-900/80 dark:group-hover:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950">
              <Image src="/logo.svg" height={24} width={24} alt="logo" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-tight">
                Habitoo
              </p>
              <p className="text-xs text-muted-foreground">
                Habit tracker
              </p>
            </div>
          </div>
        </div>
      </Link>

      <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Navigate
      </div>

      <nav className="flex flex-1 flex-col gap-1.5">
        <SidebarItem 
          label="Habits" 
          href="/habits"
          icon="Folders"
        />

        <SidebarItem 
          label="Analytics" 
          href="/analytics"
          icon="ChartNoAxesColumn"
        />
      </nav>

      <div className="mb-3 rounded-md border border-black/10 bg-zinc-50/80 p-3 dark:border-white/10 dark:bg-zinc-900/70">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <CalendarCheck2 className="h-3.5 w-3.5 text-emerald-500" />
          Today
        </div>
        <p className="mt-2 text-sm font-semibold">
          Keep the board light
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Log the small wins and let the totals do the talking.
        </p>
        <div className="mt-3 flex items-center gap-2 rounded-md bg-white px-2 py-1.5 text-xs text-muted-foreground dark:bg-zinc-950/70">
          <BarChart3 className="h-3.5 w-3.5" />
          Analytics updates live
        </div>
      </div>

      <div className="flex items-center justify-between rounded-md border border-black/10 bg-zinc-50 px-3 py-2 dark:border-white/10 dark:bg-zinc-900/70">
        <span className="text-xs font-medium text-muted-foreground">
          Theme
        </span>
        <ModeToggle />
      </div>
    </aside>
  );
};
