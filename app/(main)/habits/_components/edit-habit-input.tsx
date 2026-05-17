"use client"
import { useEffect, useState } from "react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { HabitNamePicker } from "@/app/(main)/habits/_components/form/habit-name-picker";
import { GoalRow } from "@/app/(main)/habits/_components/form/goal-row";
import { SettingRow } from "@/app/(main)/habits/_components/form/setting-row";
import { Input } from "@/components/ui/input";
import { Field, FieldError } from "@/components/ui/field";

import { formSchema, Habit, HabitFormValues } from "@/lib/types";

import { useEditHabit } from "@/hooks/mutations/use-edit-habit";
import { useRouter } from "next/navigation";


import { 
  Dialog,
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

import { DeleteButton } from "./delete-button";

type Props = {
  habit: Habit;
  children: React.ReactNode;
}


export const EditHabitInput = ({ habit, children }: Props) => {

  const [open, setOpen] = useState(false);

  const router = useRouter();
  // 1. Destructured isLoading here
  // const { data: habit } = useHabitById(habitId!, open);
  const { mutate: editMutate } = useEditHabit();

 
  const defaultValues: HabitFormValues = {
    name: habit?.name ?? "",
    description: habit?.description ?? "",
    startDate: habit?.startDate ?? new Date().toISOString().split("T")[0],
    // 2. Explicitly cast to Number to satisfy the Zod schema
    targetValue: habit?.targetValue ? habit.targetValue : 1,
    unit: habit?.unit ?? "times",
    frequency: habit?.frequency as "day" | "week" | "month" | "year",
    icon: habit?.icon ?? "Activity",
    color: habit?.color ?? "#3b82f6",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { control, handleSubmit, setValue, reset } = form;

  const watchedIcon = useWatch({ control, name: "icon" });
  const watchedColor = useWatch({ control, name: "color" });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  
    if (!habit) {
      toast.error("Missing habit id");
      return;
    }

    editMutate(
      { id: habit.id!, data },
      {
        onSuccess: () => {
          toast.success("Edit Successful", {
          description: "None of your Business"
        })
        router.refresh()
        setOpen(false);
      },
      onError: () => toast.error("Failed to update habit"),
      }
    );
  };
  useEffect(() => {
    if(habit){
      reset(mapHabitToFormValues(habit));
    }
  }, [habit, reset]);

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-125 overflow-hidden">
        <DialogHeader>
        <DialogTitle>Edit Habit</DialogTitle>
        <DialogDescription>
          Change the Attributes
        </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col w-full">
          <form
            id="habit-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3"
          >
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <HabitNamePicker
                    value={field.value}
                    onChange={field.onChange}
                    icon={watchedIcon}
                    color={watchedColor}
                    onIconChange={(icon) => setValue("icon", icon)}
                    onColorChange={(color) => setValue("color", color)}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <SettingRow label="Goal">
              <GoalRow control={control} />
            </SettingRow>

            <SettingRow label="Start Date">
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="date"
                    className="max-w-sm text-sm"
                  />
                )}
              />
            </SettingRow>
          </form>
        </div>
        <DialogFooter className="flex justify-between">
          <div className="space-x-2">
            <Button variant="outline" className="text-xs">
              Archive
            </Button>
          <DeleteButton id={habit.id}>
            <Button variant={"destructive"}>
              Delete
            </Button>
          </DeleteButton>
          </div>
          <div className="space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
            >
              Reset
            </Button>

            <Button
              type="submit"
              form="habit-form"
              style={{ backgroundColor: habit.color! }}
            >
              Save Changes
            </Button>
          </div>          
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const mapHabitToFormValues = (
  habit: Habit
): HabitFormValues => {
  return {
    name: habit.name ?? "",
    description: habit.description ?? "",
    startDate: habit.startDate,
    targetValue: habit.targetValue ?? 1,
    unit: habit.unit ?? "times",
    frequency: habit.frequency,
    icon: habit.icon ?? "Activity",
    color: habit.color ?? "#3b82f6",
  };
};