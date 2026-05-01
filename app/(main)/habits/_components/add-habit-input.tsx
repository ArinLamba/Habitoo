"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { useCreateHabit } from "@/hooks/mutations/use-create-habit";


export const AddHabitInput = () => {

  const [value, setValue] = useState("");
  const { mutate, isPending } = useCreateHabit();


  const add = () => {
    if (!value.trim()) return;

    mutate(value, {
      onSuccess: () => {
        toast.success("Habit Added Successfully");
      },
      onError: () => {
        toast.error("Failed to add habit");
      },
    });

    setValue("");
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
        disabled={!value.trim() || isPending}
        className="absolute right-0 top-1/2 -translate-y-1/2"
      >
        <Plus className="h-4 w-4 text-green-600 dark:text-green-300"/>
      </Button>
    </div>
  );
};