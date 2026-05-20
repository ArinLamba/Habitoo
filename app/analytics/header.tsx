import { MobileLeftSidebar } from "@/components/layout/mobile-left-sidebar";
import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <nav className="xl:hidden flex h-[35px] items-center justify-between dark:bg-mauve-900  border-b-gray-300 dark:border-b-gray-800  border-b shadow-xs fixed top-0 w-full z-50">

      {/* LEFT */}
      <MobileLeftSidebar />

      {/* CENTER */}
      <Link href="/habits">
        <div className=" flex items-center gap-x-3  ">
          <Image src="/logo.svg" height={30} width={30} alt="logo" />
          <h1 className="text-md  whitespace-nowrap">
            <p className="font-light italic ">
              HABIT  <span className="font-bold not-italic p-1 font">TRACKER</span>
            </p>
          </h1>
        </div>
      </Link>
      
      <div />

    </nav>
  );
};