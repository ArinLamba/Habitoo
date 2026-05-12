import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import Image from "next/image";
import { ModeToggle } from "../mode-toggle";
import { RangeSelect } from "../range-selector";
import { GridListTogle } from "../grid-list-toggle";


export const MobileHeader = () => {
  return (
    <nav className="px-4 h-[50px] flex items-center justify-between bg-gray-50 dark:bg-zinc-900 border-b border-b-gray-300 dark:border-b-gray-800 shadow-xs fixed top-0 w-full z-50">

      {/* LEFT */}
      <div className="flex items-center gap-6">
        <MobileSidebar />
        <div className="flex items-center justify-center gap-x-2">
          <Image src="/logo.svg" height={28} width={28} alt="logo" />
          <h1 className="text-lg  whitespace-nowrap">
            <p className="font-lightt italic ">
              HABIT  <span className="font-bold not-italic p-1 font">TRACKER</span>
            </p>
          </h1>
        </div>
      </div>

      {/* CENTER */}
      <div className="flex items-center gap-x-2">
        <GridListTogle />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        <RangeSelect />
        <ModeToggle />
      </div>

    </nav>
  );
};

