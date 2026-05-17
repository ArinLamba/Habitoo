

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { AddHabitInput } from "@/app/(main)/habits/_components/add-habit-input"
import { IconFolderCode } from "@tabler/icons-react"

export function EmptyState() {
  return (
    <Empty >
      <EmptyHeader>
        <EmptyMedia variant="icon" >
          <IconFolderCode />
        </EmptyMedia>
        <EmptyTitle>No Habits Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any habits yet. <br/> Track Your Progress by creating
          your first habit.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent >
        <AddHabitInput />
      </EmptyContent>
      
    </Empty>
  )
}
