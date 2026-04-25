"use client";

import { useState } from "react";
import { Check, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

import { editHabit } from "@/actions/edit-habit";
import { deleteHabit } from "@/actions/delete-habit";
import { DeleteButton } from "./delete-button";

import { Completion } from "@/lib/types";
import { getHabitStreaks } from "@/lib/helper";
import { useHabitStore } from "@/store/use-habit-store";
import { useViewStore } from "@/store/use-view-store";
import { useDrawerModal } from "@/store/use-drawer-modal";
import { useIsMobile } from "@/hooks/use-is-mobile";

type Props = {
  id: string;
  name: string;
  createdAt: string;
  completions: Completion[];
};

export const HabitItem = ({ 
  id, 
  name,
  createdAt, 
  completions 
}: Props) => {

  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const router = useRouter();

  const { setSelectedHabit } = useHabitStore();
  const { open } = useDrawerModal();
  const isMobile = useIsMobile();
  const setView = useViewStore((s) => s.setView);

  const { currentStreak } = getHabitStreaks(id, completions);

  const handleDelete = async () => {
    toast.success("Habit Deleted");
    await deleteHabit(id);
    router.refresh();
  }

  const save = async () => {
    if (!value.trim()) return;

    await editHabit(id, value);
    setEditing(false);
    toast.success("Edit Successful");
    router.refresh();
  };

  return (
    <>
      <div className="flex items-center min-w-0 justify-between">

        <div className="flex gap-x-3 items-center min-w-0">
          <p className=" shrink-0 text-orange-400 transition-all duration-300 scale-100 hover:scale-110 cursor-default">
            🔥 {currentStreak}
          </p>

          {editing ? (
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" ) save();
                if (e.key === "Escape") {
                  setValue(name);
                  setEditing(false);
                }
              }}
              autoFocus
              className="text-sm  mr-2"
              
            />
          ) : (
            <div
              className=" truncate mr-2 cursor-pointer"
              title={name}
              onClick={() => {
                setSelectedHabit({id, name, createdAt});
                setView("habit");
                if(isMobile) open();
              }}
            >
              {name}
            </div>
          )}
        </div>

        {editing ? (
          <Button size="sm" variant="save" className="mx-1 ml-auto pl-2" onClick={save} disabled={!value.trim()}>
            <Check className="h-4 w-4 text-green-700 dark:text-green-300"/>
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
        <DeleteButton handleDelete={handleDelete}/>

      </div>

      <div className="border-b dark:border-white/20 border-black/10" />
    </>
  );
};