"use client"

import { Button } from "@/components/ui/button";
import {
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";

export const Header = () => {
  const { isLoaded, isSignedIn } = useAuth();

  const buttonContent = (
    <Button size="lg" variant="ghost">
      Login
    </Button>
  );

  if (!isLoaded) {
    return (
      <Loader className="h-5 w-5 animate-spin" />
    );
  }
  return (
    <header className="h-20 w-full border-b  border-slate-800 px-4">
      <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Image src="/logo.svg" height={40} width={40} alt="Mascot" />
          <h1 className="text-lg  whitespace-nowrap">
            <p className="font-lightt italic ">
              HABIT  <span className="font-bold not-italic p-1 font">TRACKER</span>
            </p>
          </h1>
        </div>
        {isSignedIn ? (
          <>
            <UserButton />
          </>
        ) : (
          <SignInButton mode="modal">{buttonContent}</SignInButton>
        )}
      </div>
    </header>
  );
};
