"use client";
import * as Icons from "lucide-react";

import { toast } from "sonner";


import { DeleteButton } from "./delete-button";

import {  Habit, LucideIconName } from "@/lib/types";


import { useDeleteHabit } from "@/hooks/mutations/use-delete-habit";


import { useRouter } from "next/navigation";
import { EditHabitInput } from "./edit-habit-input";

type Props = {
  habit: Habit;
};

export const HabitItem = ({
  habit,
}: Props) => {

  const { mutate: deleteMutate } = useDeleteHabit();
  const router = useRouter();

  const IconComponent = (Icons[habit.icon as LucideIconName] as React.ElementType) || Icons.Activity;


  const handleDelete = () => {
    deleteMutate(habit.id, {
      onSuccess: () => toast.success("Habit Deleted"),
      onError: () => toast.error("Failed to delete habit"),
    });
  };

  
  return (
    <>
      <div className="flex items-center justify-between bg-ar-800 border-b dark:border-white/10 border-black/10 ">
        <div className="flex-1 min-w-0">
          <div className="flex gap-x-3 items-center">
            <p className="shrink-0 text-orange-400 transition-all duration-300 scale-100 hover:scale-110 cursor-default">
              <IconComponent size={18} color={habit.color}/>
            </p>
            <div
              className="truncate mr-2 cursor-pointer text-sm font-medium py-[6.5px]"
              title={habit?.name}
              onClick={() => {
                router.push(`/habits/${habit.id}`);
              }}
            >
              
              {habit?.name}
            </div>
          </div>
        </div>
        <EditHabitInput habit={habit}/>
        <DeleteButton handleDelete={handleDelete} />
      </div>

      {/* <div className="border-b dark:border-white/10 border-black/10" /> */}
    </>
  );
};