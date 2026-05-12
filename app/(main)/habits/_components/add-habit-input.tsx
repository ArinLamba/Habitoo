import { AddHabitForm } from "@/components/habits/form/add-habit-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";


export const AddHabitInput = () => {
  return (
    <div className="flex-1 text-xs flex items-center">
        <Dialog >
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 text-indigo-400 ">
              <Plus size={18} />
              <p>Add Habit</p>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] overflow-hidden">
           <DialogHeader>
            <DialogTitle>New Habit</DialogTitle>
            <DialogDescription>
              Build Habits To your improve pathetic life
            </DialogDescription>
            </DialogHeader>
            <AddHabitForm />
          </DialogContent>
        </Dialog>
      </div>
  );
};