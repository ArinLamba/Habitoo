"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, useAuth, UserButton } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-20 w-full border-b border-white/10 bg-zinc-950/90 px-5 text-white backdrop-blur">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between">
        <Link className="flex items-center gap-3" href="/">
          <Image
            alt="Habitoo logo"
            className="rounded-md"
            height={38}
            src="/logo.png"
            width={38}
          />
          <span className="text-lg font-black tracking-normal">Habitoo</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            className="hidden text-sm font-bold text-zinc-400 transition-colors hover:text-white sm:block"
            href="#features"
          >
            Features
          </Link>
          {!isLoaded ? (
            <Loader className="size-5 animate-spin text-blue-400" />
          ) : isSignedIn ? (
            <>
              <Button asChild className="hidden bg-blue-500 text-white hover:bg-blue-400 sm:inline-flex">
                <Link href="/habits">Open app</Link>
              </Button>
              <UserButton />
            </>
          ) : (
            <SignInButton mode="modal">
              <Button
                className="border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800"
                variant="outline"
              >
                Login
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
};
