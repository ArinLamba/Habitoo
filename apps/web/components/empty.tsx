

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
}
