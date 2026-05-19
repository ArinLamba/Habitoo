"use client";
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useAddLog } from "@/hooks/mutations/use-add-log";
import { getToday } from "@/lib/date";
import { Habit } from "@/lib/types"
import { Notebook } from "lucide-react";
import { useState } from "react";

type Props = {
  habit: Habit;
};

export const AddLogForm = ({ habit }: Props) => {

  const [value, setValue] = useState(1);
  
  const { mutate: addLog, isPending } = useAddLog();
  
  const [date, setDate] = useState(getToday());

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} className="">
          <Notebook />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <PopoverHeader>
          <PopoverTitle>Add Logs</PopoverTitle>
          <PopoverDescription>
            Set the Progress you have made so far.
          </PopoverDescription>
        </PopoverHeader>
        <FieldGroup className="gap-4">
          <Field orientation="horizontal">
            <Input  
              type="number"
              value={value}
              onChange={(e) => setValue(Math.max(0, Number(e.target.value)))}
            />
            <FieldLabel htmlFor="unit" className="">
              {habit.unit}
            </FieldLabel>
          </Field>
          <Field orientation="vertical">
            <FieldLabel htmlFor="date" className="w-full">
              Date
            </FieldLabel>
            <Input 
              type="date" 
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
             />
          </Field>
        </FieldGroup>
        <Button
          disabled={isPending}
          onClick={() => {
            addLog({
              habitId: habit.id,
              value,
              date,
            });
          }}
        >
          {isPending ? "Saving" : "Save"}
        </Button>
      </PopoverContent>
    </Popover>
  )
}
