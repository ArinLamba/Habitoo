import { EllipsisVertical, PencilIcon, TrashIcon } from "lucide-react"

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

type Props = {
  habit: Habit;
}

export const HabitActions = ({ habit }: Props) => {
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
