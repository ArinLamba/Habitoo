
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { Button } from "./ui/button";

import { LogIn, Sparkles, UserRoundPlus } from "lucide-react";

import { SignInButton, SignUpButton } from "@clerk/nextjs";

export const LoginPrompt = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="text-blue-500 size-9">
          <Sparkles className="size-6" />
        </EmptyMedia>

        <EmptyTitle>Welcome Back</EmptyTitle>

        <EmptyDescription>
          Your habits are waiting for you.
          <br/>
          Sign in to continue building a better you.
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent className="flex-row justify-center gap-2">
        <SignInButton mode="modal">
          <Button
            size="md"
            variant="outline"
            className="gap-2 transition-transform hover:scale-105"
          >
            Sign In
            <LogIn className="size-4" />
          </Button>
        </SignInButton>

        <SignUpButton mode="modal">
          <Button
            size="md"
            className="gap-2 bg-blue-500 transition-transform hover:scale-105 dark:bg-blue-400"
          >
            Sign Up
            <UserRoundPlus className="size-4" />
          </Button>
        </SignUpButton>
      </EmptyContent>
    </Empty>
  );
};
