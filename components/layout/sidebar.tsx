
import Link from "next/link";
import Image from "next/image";


import { cn } from "@/lib/utils";
import { SidebarItem } from "./sidebar-item";
import { ModeToggle } from "../mode-toggle";

type Props = {
  className?:  string;
};

export const Sidebar = ({ className }: Props) => {

  // const { isSignedIn } = useAuth();

  return (
    <div className={cn("flex  w-[240px] md:fixed left-0 px-4 pt-2 flex-col dark:bg-zinc-900/60 bordr border-r border-t rounded-md",
    className,
    )}>

      <Link href="/habits">
        <div className="  pb-7 flex items-center gap-x-3  ">
          <Image src="/logo.svg" height={30} width={30} alt="logo" />
          <h1 className="text-md  whitespace-nowrap">
            <p className="font-light italic ">
              HABIT  <span className="font-bold not-italic p-1 font">TRACKER</span>
            </p>
          </h1>
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
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
      </div>
      <div className="p-4"> 
        <ModeToggle />
      </div>
    </div>
  );
};