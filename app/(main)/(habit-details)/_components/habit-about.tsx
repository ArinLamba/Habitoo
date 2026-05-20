import { useEffect, useState } from "react";

import { Field, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useEditHabit } from "@/hooks/mutations/use-edit-habit";
import { formatDate } from "@/lib/date";
import { Habit } from "@/lib/types";

type Props = {
  habit: Habit;
};

export const HabitAbout = ({ habit }: Props) => {
  
  const initialDescription = habit.description ?? "";
  const [description, setDescription] = useState(initialDescription);
  const [savedDescription, setSavedDescription] = useState(initialDescription);
  
  const { mutate: editHabit, isPending } = useEditHabit();

  const isDirty = description !== savedDescription;

  const createdInfo = formatDisplayDate(formatDate(habit.createdAt));
  const startedInfo = formatDisplayDate(habit.startDate);
  const updatedInfo = formatRelativeDateTime(habit.updatedAt);

  const handleSave = () => {
    editHabit(
      {
        id: habit.id,
        data: {
          description,
        },
      },
      {
        onSuccess: () => {
          setSavedDescription(description);
        },
      }
    );
  };

  return (
    <div className="flex flex-col p-2 gap-3">
      <Field>
        <FieldLabel>Description</FieldLabel>

        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="text-xs"
          placeholder="Write about your habit and what it means to you"
        />

        <div className="flex items-center justify-between">
          {isDirty ? (
            <p className="text-xs text-yellow-500">
              Unsaved changes
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Saved
            </p>
          )}

          <Button
            size="sm"
            onClick={handleSave}
            disabled={isPending || !isDirty}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </Field>

      <div className="flex flex-col gap-y-2">
        <h1 className="text-sm font-medium tracking-tight">
          Info
        </h1>

        <Separator />

        <div className="flex justify-between text-xs mt-2">
          <h2>Created At</h2>
          <div className="text-muted-foreground">
            <p>{createdInfo.date}</p>
            <p>{createdInfo.days}</p>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between text-xs mt-2">
          <h2>Started At</h2>
          <div className="text-muted-foreground">
            <p>{startedInfo.date}</p>
            <p>{startedInfo.days}</p>
          </div>
        </div>
        
        <Separator />
        <div className="flex justify-between text-xs mt-2">
          <h2>Updated At</h2>
          <div className="text-muted-foreground">
            <p>{updatedInfo.date} • {updatedInfo.time}</p>
            <p>{updatedInfo.relative}</p>
          </div>
        </div>

        <Separator />
      </div>
    </div>
  );
};

const formatDisplayDate = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();

  const date = d.toLocaleDateString("default", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const diffMs = today.getTime() - d.getTime();

  const days = Math.floor(
    diffMs / (1000 * 60 * 60 * 24)
  );

  const relative =
  days === 0
    ? "Today"
    : days === 1
    ? "1 day ago"
    : `${days} days ago`;

  return { days: relative, date };
};

const formatRelativeDateTime = (
  input: string | Date
) => {
  const d = new Date(input);
  const now = new Date();

  const date = d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const time = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(d);

  const diffMs = now.getTime() - d.getTime();

  const days = Math.floor(
    diffMs / (1000 * 60 * 60 * 24)
  );

  const relative =
    days === 0
      ? "Today"
      : days === 1
      ? "1 day ago"
      : `${days} days ago`;

  return {
    date,
    time,
    relative,
  };
};