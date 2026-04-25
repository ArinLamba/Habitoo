"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { upsertNewHabit } from "@/actions/add-habit";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const AddHabitInput = () => {
  const [value, setValue] = useState("");
  const router = useRouter();

  const add = async () => {
    if (!value.trim()) return;
    
    await upsertNewHabit(value);
    setValue("");
    toast.success("Habit Added Successfully");
    
    // router.refresh();
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