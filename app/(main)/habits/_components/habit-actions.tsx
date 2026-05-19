"use client"

import { ArchiveIcon, CheckCircle2, EllipsisVertical, PencilIcon, RotateCcw, TrashIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditHabitInput } from "./edit-habit-input"
import { Habit } from "@/lib/types"
import { DeleteButton } from "./delete-button"
import { useSetHabitLifecycle } from "@/hooks/mutations/use-set-habit-lifecycle"

type Props = {
  habit: Habit;
}

export const HabitActions = ({ habit }: Props) => {
  const { mutate: setLifecycle } = useSetHabitLifecycle();

  const updateLifecycle = (
    lifecycle: Habit["lifecycle"],
    label: string
  ) => {
    setLifecycle(
      { id: habit.id, lifecycle },
      {
        onSuccess: () => toast.success(label),
        onError: () => toast.error("Failed to update habit"),
      }
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"}>
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <EditHabitInput habit={habit}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <PencilIcon />
              Edit
            </DropdownMenuItem>
          </EditHabitInput>
          {habit.lifecycle !== "completed" && (
            <DropdownMenuItem
              onClick={() =>
                updateLifecycle("completed", "Habit ended")
              }
            >
              <CheckCircle2 />
              End Habit
            </DropdownMenuItem>
          )}
          {habit.lifecycle !== "archived" && (
            <DropdownMenuItem
              onClick={() =>
                updateLifecycle("archived", "Habit archived")
              }
            >
              <ArchiveIcon />
              Archive
            </DropdownMenuItem>
          )}
          {habit.lifecycle !== "active" && (
            <DropdownMenuItem
              onClick={() =>
                updateLifecycle("active", "Habit restored")
              }
            >
              <RotateCcw />
              Restore
            </DropdownMenuItem>
          )}
         
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DeleteButton id={habit.id}>
            <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
              <TrashIcon />
              Delete
            </DropdownMenuItem>
          </DeleteButton>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
