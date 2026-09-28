
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { AddHabitInput } from "@/app/(main)/(habits-list)/habits/_components/add-habit-input"
import { Target } from "lucide-react"


export function EmptyState() {

    return (
      <Empty >
        <EmptyHeader>
          <EmptyMedia variant="icon" className="text-blue-500">
            <Target />
          </EmptyMedia>
          <EmptyTitle>No habits yet</EmptyTitle>
          <EmptyDescription>
            Start with one small habit and Habitoo will keep the progress readable.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent >
          <AddHabitInput />
        </EmptyContent>
 
      </Empty>
    )
      // <Empty >
      //   <EmptyHeader>
      //     <EmptyMedia variant="icon" className="text-blue-500">
      //       <Target />
      //     </EmptyMedia>
      //     <EmptyTitle>No habits yet</EmptyTitle>
      //     <EmptyDescription>
      //       Start with one small habit and Habitoo will keep the progress readable. <br/> Sign In to Build yourself
      //     </EmptyDescription>
      //   </EmptyHeader>
      //   <EmptyContent className="flex-row justify-center gap-2">
      //     <SignInButton mode="modal">
      //       <Button size="md" variant="outline" className="hover:scale-105 gap-2">
      //         <p>Sign In</p>
      //         <LogIn />
      //       </Button>
      //     </SignInButton>
      //     <SignUpButton mode="modal">
      //       <Button size="md" className="dark:bg-blue-400 bg-blue-500 hover:scale-105 gap-2">
      //         Sign Up
      //         <UserRoundPlus />
      //       </Button>
      //     </SignUpButton>
      //   </EmptyContent>
      // </Empty>
    
  
};
