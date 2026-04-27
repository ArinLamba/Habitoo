"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { upsertNewHabit } from "@/actions/add-habit";

import { toast } from "sonner";
import { useHabitStore } from "@/store/use-habit-store";

export const AddHabitInput = () => {
  const [value, setValue] = useState("");

  const addHabit = useHabitStore((s) => s.addHabit);
  const replaceHabit = useHabitStore((s) => s.replaceHabit);

  const add = async () => {
    if (!value.trim()) return;

    const tempId = crypto.randomUUID();

    // 🔥 optimistic UI
    addHabit({
      id: tempId,
      name: value,
      createdAt: new Date().toISOString(),
    });

    setValue("");
    toast.success("Habit Added Successfully");

    try {
      const realHabit = await upsertNewHabit(value);
      replaceHabit(tempId, realHabit);
      // optional: replace temp with real id (advanced, can skip for now)
    } catch {
      toast.error("Failed to add habit");
      // rollback
      useHabitStore.getState().deleteHabit(tempId);
    }
  };

  return (
    <div className="relative mt-2">
      <Input
        value={value}
        placeholder="Add New Habit"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") add();
        }}
      />

      <Button
        variant="save"
        onClick={add}
        disabled={!value.trim()}
        className="absolute right-0 top-1/2 -translate-y-1/2"
      >
        <Plus className="h-4 w-4 text-green-600 dark:text-green-300"/>
      </Button>
    </div>
  );
};