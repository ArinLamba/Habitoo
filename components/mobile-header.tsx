import { MobileSidebar } from "@/components/mobile-sidebar";
import Image from "next/image";
import { ModeToggle } from "./mode-toggle";


export const MobileHeader = () => {
  return (
    <nav className="px-6 h-[50px] flex justify-between items-center bg-gray-50 dark:bg-zinc-800  border-b border-b-gray-300 dark:border-b-gray-800 shadow-xs fixed top-0 w-full z-50">
      <MobileSidebar />
      <div className="left-1/2 absolute -translate-x-1/2 flex items-center gap-x-3">
        <Image src="/logo.svg" height={30} width={30} alt="logo" />
        <h1 className="text-xl font-medium">
          Habitoo
        </h1>
      </div>
      <ModeToggle />
    </nav>
  );
};

