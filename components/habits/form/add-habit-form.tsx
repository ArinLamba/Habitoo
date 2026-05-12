"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"


import { HabitNamePicker } from "@/components/habits/form/habit-name-picker"
import { GoalRow } from "@/components/habits/form/goal-row" 
import { SettingRow } from "@/components/habits/form/setting-row"
import { Input } from "@/components/ui/input"
import { Field, FieldError } from "@/components/ui/field"
import { formSchema, HabitFormValues } from "@/lib/types"
import { useCreateHabit } from "@/hooks/mutations/use-create-habit"



export const AddHabitForm = () => {

  const { mutate } = useCreateHabit();

  const form = useForm<HabitFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: new Date().toISOString().split("T")[0],
      targetValue: 1,
      unit: "times",
      frequency: "day",
      icon: "Activity",
      color: "#3b82f6",
    },
  })

  // Destructure for cleaner access
  const { control, handleSubmit, setValue, reset } = form;
  const watchedIcon = useWatch({ control, name: "icon" });
  const watchedColor = useWatch({ control, name: "color" });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    toast.success("Habit Created!", {
      description: `Tracking ${data.name} Starting From ${data.startDate}` 
    });
    console.log(typeof data.targetValue, data);
    
    mutate(data, {
      onSuccess: () => {
        toast.success("Habit Added Successfully");
      },
      onError: () => {
        toast.error("Failed to add habit");
      },
    });
  };

  return (
  <div className="flex flex-col w-full ">

    <form
      id="habit-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 "
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
              onIconChange={(icon) =>
                setValue("icon", icon)
              }
              onColorChange={(color) =>
                setValue("color", color)
              }
            />

            {fieldState.invalid && (
              <FieldError
                errors={[fieldState.error]}
              />
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

    <div className="flex justify-end gap-3 border-t px-6 py-4">
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
        className=""
      >
        Create
      </Button>
    </div>

  </div>
)
};