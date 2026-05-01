import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import Image from "next/image";
import { ModeToggle } from "../mode-toggle";
import { RangeSelect } from "../range-selector";


export const MobileHeader = () => {
  return (
    <nav className="px-4 h-[50px] flex items-center justify-between bg-gray-50 dark:bg-zinc-800 border-b border-b-gray-300 dark:border-b-gray-800 shadow-xs fixed top-0 w-full z-50">

      {/* LEFT */}
      <div className="flex items-center">
        <MobileSidebar />
      </div>

      {/* CENTER */}
      <div className="flex items-center gap-x-2">
        <Image src="/logo.svg" height={28} width={28} alt="logo" />
        <h1 className="text-lg font-medium whitespace-nowrap">
          Habitoo
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        <RangeSelect />
        <ModeToggle />
      </div>

    </nav>
  );
};

