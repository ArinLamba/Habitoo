"use client";

import { useState } from "react";
import { Check, Edit2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

import { editHabit } from "@/actions/edit-habit";
import { deleteHabit } from "@/actions/delete-habit";
import { DeleteButton } from "./delete-button";

import { Completion, Habit } from "@/lib/types";
import { getHabitStreaks } from "@/lib/helper";
import { useHabitStore } from "@/store/use-habit-store";
import { useViewStore } from "@/store/use-view-store";
import { useDrawerModal } from "@/store/use-drawer-modal";
import { useIsMobile } from "@/hooks/use-is-mobile";

type Props = {
  habit: Habit;
  completions: Completion[];
};

export const HabitItem = ({
  habit,
  completions,
}: Props) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");

  // 🔥 Get live habit from Zustand (source of truth)


  const updateHabit      = useHabitStore((s) => s.updateHabit);
  const removeHabit      = useHabitStore((s) => s.deleteHabit);
  const setSelectedHabit = useHabitStore((s) => s.setSelectedHabit);

  const { open } = useDrawerModal();
  const setView  = useViewStore((s) => s.setView);
  const isMobile = useIsMobile();

  // 🔥 Sync input with store (important for optimistic UI)
  // useEffect(() => {
  //   if (habit) setValue(habit.name);
  // }, [habit]);

  const { currentStreak } = getHabitStreaks(habit.id, completions);

  const handleDelete = async () => {
    removeHabit(habit.id); // 🔥 instant UI

    try {
      await deleteHabit(habit.id);
      toast.success("Habit Deleted");
    } catch {
      toast.error("Failed to delete habit");
    }
  };

  const save = async () => {
    if (!value.trim()) return;

    updateHabit(habit.id, value); // 🔥 instant UI
    setEditing(false);
    toast.success("Edit Successful");

    try {
      await editHabit(habit.id, value);
    } catch {
      toast.error("Failed to update habit");
    }
  };

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
                setSelectedHabit(habit);
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