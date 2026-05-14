import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";


import { Button } from "@/components/ui/button";
import { HabitNamePicker } from "@/components/habits/form/habit-name-picker";
import { GoalRow } from "@/components/habits/form/goal-row";
import { SettingRow } from "@/components/habits/form/setting-row";
import { Input } from "@/components/ui/input";
import { Field, FieldError } from "@/components/ui/field";

import { formSchema, HabitFormValues } from "@/lib/types";
import { useCreateHabit } from "@/hooks/mutations/use-create-habit";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Plus } from "lucide-react";
import { useState } from "react";

export const AddHabitInput = () => {

  const [open, setOpen] = useState(false);

  const { mutate: createMutate } = useCreateHabit();


  const defaultValues: HabitFormValues = {
    name: "",
    description: "",
    startDate: new Date().toISOString().split("T")[0],
    targetValue: 1,
    unit: "times",
    frequency: "day",
    icon: "Plus",
    color: "#3b82f6",
  };

  const form = useForm<HabitFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { control, handleSubmit, setValue, reset } = form;

  const watchedIcon = useWatch({ control, name: "icon" });
  const watchedColor = useWatch({ control, name: "color" });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Note: You might want a separate useUpdateHabit hook for "edit" mode
    console.log(data);
    
    createMutate(data, {
      onSuccess: () => {
        toast.success("Habit Created!", {
          description: `Tracking ${data.name} starting from ${data.startDate}` 
        });
        setOpen(false);
      },
      onError: () => {
        toast.error("An error occurred");
      },
    });
    
  };

  return (
    <div className="flex-1 text-xs flex items-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button 
          
          className="flex items-center gap-2 dark:text-indigo-400 text-blue-700 font-semibold 
          ">
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
          <DialogFooter>  
            <Button
              type="button"
              variant="secondary"
              onClick={() => reset()}
            >
              Reset
            </Button>

            <Button
              type="submit"
              form="habit-form"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};