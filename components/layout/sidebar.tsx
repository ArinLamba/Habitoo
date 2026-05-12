
import Link from "next/link";
import Image from "next/image";
import {
  UserButton,

} from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { SidebarItem } from "./sidebar-item";

type Props = {
  className?:  string;
};

export const Sidebar = ({ className }: Props) => {

  // const { isSignedIn } = useAuth();

  return (
    <div className={cn("flex h-full xl:w-[240px] md:fixed left-0 top-0 px-4 flex-col",
    className,
    )}>

      <Link href="/habits">
        <div className="pt-8 pl- pb-7 flex items-center gap-x-3 ">
          <Image src="/logo.svg" height={30} width={30} alt="logo" />
          <h1 className="text-lg  whitespace-nowrap">
            <p className="font-lightt italic ">
              HABIT  <span className="font-bold not-italic p-1 font">TRACKER</span>
            </p>
          </h1>
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItem 
          label="Habits" 
          href="/habits"
          iconSrc="/habits.svg" 
        />
        <SidebarItem 
          label="Planner" 
          href="/planner"
          iconSrc="/plan.svg" 
        />
      </div>
      <div className="p-4 z-100">   
        <UserButton />
      </div>
    </div>
  );
};