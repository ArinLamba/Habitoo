

import { MobileLeftSidebar } from "@/components/layout/mobile-left-sidebar";
import { MobileRightSidebar } from "@/components/layout/mobile-right-sidebar";

import { GridListTogle } from "../grid-list-toggle";
import { UserButton } from "@clerk/nextjs";
import { StickyWrapperClient } from "./sticky-wrapper-client";


export const MobileHeader = () => {
  return (
    <nav className=" h-[35px] flex items-center justify-between dark:bg-mauve-900  border-b-gray-300 dark:border-b-gray-800  border-b shadow-xs fixed top-0 w-full z-50">

      {/* LEFT */}
      <MobileLeftSidebar />

      {/* CENTER */}
      <div className="flex items-center gap-x-2">
        <GridListTogle />
      </div>

      {/* RIGHT */}
      <div className="pr-2 flex items-center  gap-2">
        <UserButton />
        <MobileRightSidebar>
          <StickyWrapperClient />
        </MobileRightSidebar>
      </div>

    </nav>
  );
};
