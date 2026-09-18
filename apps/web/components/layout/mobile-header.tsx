
import { MobileLeftSidebar } from "@/components/layout/mobile-left-sidebar";
import { MobileRightSidebar } from "@/components/layout/mobile-right-sidebar";

import { GridListTogle } from "../grid-list-toggle";
import { UserButton } from "@clerk/nextjs";
import { StickyWrapperClient } from "./sticky-wrapper-client";


export const MobileHeader = () => {
  return (
    <nav className="fixed top-0 z-50 flex h-[40px] w-full items-center justify-between border-b border-black/10 bg-white/95 px-1 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-950/95">

      {/* LEFT */}
      <MobileLeftSidebar />

      {/* CENTER */}
      <div className="flex items-center gap-x-2">
        <GridListTogle />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 pr-2">
        <UserButton />
        <MobileRightSidebar>
          <StickyWrapperClient />
        </MobileRightSidebar>
      </div>

    </nav>
  );
};
