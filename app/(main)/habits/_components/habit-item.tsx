"use client";

import { useState } from "react";
import { Check, Edit2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

import { DeleteButton } from "./delete-button";

import {  Habit } from "@/lib/types";


import { useHabitStore } from "@/store/use-habit-store";
import { useViewStore } from "@/store/use-view-store";
import { useDrawerModal } from "@/store/use-drawer-modal";

import { useIsMobile } from "@/hooks/use-is-mobile";
import { useDeleteHabit } from "@/hooks/mutations/use-delete-habit";
import { useEditHabit } from "@/hooks/mutations/use-edit-habit";


type Props = {
  habit: Habit;
  currentStreak: number;
};

export const HabitItem = ({
  habit,
  currentStreak
}: Props) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(habit.name);

  const { mutate: deleteMutate } = useDeleteHabit();
  const { mutate: editMutate } = useEditHabit();

  // 🔥 Get live habit from Zustand (source of truth)
  const setSelectedHabitId = useHabitStore((s) => s.setSelectedHabitId);

  const { open } = useDrawerModal();
  const setView  = useViewStore((s) => s.setView);
  const isMobile = useIsMobile();

  // TODO: fix streaks to precompute or move it from here
  // const { currentStreak } = getHabitStreaks(habit.id, completions);
 

  const handleDelete = () => {
    deleteMutate(habit.id, {
      onSuccess: () => toast.success("Habit Deleted"),
      onError: () => toast.error("Failed to delete habit"),
    });
  };

  const save = () => {
    if (!value.trim()) return;

    editMutate(
      { id: habit.id, name: value },
      {
        onSuccess: () => toast.success("Edit Successful"),
        onError: () => toast.error("Failed to update habit"),
      }
    );

    setEditing(false);
  }

  
  return (
    <>
      <div className="flex items-center min-w-0 justify-between">
        <div className="flex gap-x-3 items-center min-w-0">
          <p className="shrink-0 text-orange-400 transition-all duration-300 scale-100 hover:scale-110 cursor-default">
            🔥 {currentStreak}
          </p>

          {editing ? (
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") save();
                if (e.key === "Escape") {
                  setValue(habit?.name || "");
                  setEditing(false);
                }
              }}
              autoFocus
              className="text-sm mr-2"
            />
          ) : (
            <div
              className="truncate mr-2 cursor-pointer"
              title={habit?.name}
              onClick={() => {
                if (!habit) return;
                setSelectedHabitId(habit.id);
                setView("habit");
                if (isMobile) open();
              }}
            >
              {habit?.name}
            </div>
          )}
        </div>

        {editing ? (
          <Button
            size="sm"
            variant="save"
            className="mx-1 ml-auto pl-2"
            onClick={save}
            disabled={!value.trim()}
          >
            <Check className="h-4 w-4 text-green-700 dark:text-green-300" />
          </Button>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditing(true)}
            className="ml-auto"
          >
            <Edit2 />
          </Button>
        )}

        <DeleteButton handleDelete={handleDelete} />
      </div>

      <div className="border-b dark:border-white/20 border-black/10" />
    </>
  );
};