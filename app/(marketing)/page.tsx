"use client"

import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";

import { Loader } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const { isLoaded, isSignedIn } = useAuth();
  
  const buttonUpContent = (
    <Button size="lg" variant="secondary" className="w-full">
      Get Started
    </Button>
  );

  const buttonInContent = (
    <Button size="lg" className="w-full">
      I already have an account
    </Button>
  );
  if (!isLoaded) {
    return (
      <Loader className="h-5 w-5 animate-spin" />
    );
  }

  return (
    <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-2">
      <div className="relative w-[250px] h-[240px] lg:w-[424px] lg:h-[424px] mb-8 lg:mb-0">
        <Image src="/logo.svg" fill alt="Logo" />
      </div>
      <div className="flex flex-col items-center gap-y-8">
        <h1 className="text-xl lg:text-3xl font-semibol tracking-tight max-w-[480px] text-center">
          The minimalist toolkit for building lasting habits and daily consistency.
        </h1>
        <div className="flex flex-col items-center gap-y-3 max-w-[330px] w-full">
          {!isSignedIn ? (
            <>
              <SignUpButton mode="modal">{buttonUpContent}</SignUpButton>
              <SignInButton mode="modal">{buttonInContent}</SignInButton>
            </>
          ) : (
            <Button asChild className="w-full" size="lg">
              <Link href="/habits">Continue</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};