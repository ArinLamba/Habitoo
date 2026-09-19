import { MobileLeftSidebar } from "@/components/layout/mobile-left-sidebar";
import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <nav className="fixed top-0 z-50 flex h-[40px] w-full items-center justify-between border-b border-black/10 bg-white/95 px-1 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-950/95 xl:hidden">

      {/* LEFT */}
      <MobileLeftSidebar />

      <Link href="/habits">
        <div className="flex items-center gap-x-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-blue-500/20 bg-white shadow-sm shadow-blue-500/10 dark:border-blue-400/20 dark:bg-zinc-950">
            <Image src="/logo.png" height={20} width={20} alt="logo" />
          </div>
          <p className="text-sm font-semibold tracking-tight">
            Habitoo
          </p>
        </div>
      </Link>
      
      <div />

    </nav>
  );
};
