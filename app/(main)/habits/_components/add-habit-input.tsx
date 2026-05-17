"use client";

import * as z from "zod";
import { useState } from "react";
import {
  Controller,
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Field,
  FieldError,
} from "@/components/ui/field";

import { HabitNamePicker } from "@/app/(main)/habits/_components/form/habit-name-picker";
import { GoalRow } from "@/app/(main)/habits/_components/form/goal-row";
import { SettingRow } from "@/app/(main)/habits/_components/form/setting-row";

import {
  formSchema,
  HabitFormValues,
} from "@/lib/types";

import { useCreateHabit } from "@/hooks/mutations/use-create-habit";

export const AddHabitInput = () => {
  const [open, setOpen] = useState(false);

  const { mutate: createMutate } =
    useCreateHabit();

  const defaultValues: HabitFormValues = {
    name: "",
    description: "",
    startDate: new Date()
      .toISOString()
      .split("T")[0],
    targetValue: 1,
    unit: "times",
    frequency: "day",
    icon: "QuestionMark",
    color: "#3b82f6",
  };

  const form = useForm<HabitFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    setValue,
    reset,
  } = form;

  const watchedIcon = useWatch({
    control,
    name: "icon",
  });

  const watchedColor = useWatch({
    control,
    name: "color",
  });

  const onSubmit = (
    data: z.infer<typeof formSchema>
  ) => {
    createMutate(data, {
      onSuccess: () => {
        toast.success("Habit Created!", {
          description: `Tracking ${data.name} starting from ${data.startDate}`,
        });

        reset(defaultValues);
        setOpen(false);
      },

      onError: () => {
        toast.error("An error occurred");
      },
    });
  };

  return (
    <div className="flex-1 border-b p-2 text-xs">
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger asChild>
          <button className="flex items-center gap-2 font-semibold text-blue-700 dark:text-indigo-400">
            <Plus size={18} />
            <p>Add Habit</p>
          </button>
        </DialogTrigger>

        <DialogContent className="max-h-[90vh] overflow-hidden p-0 sm:max-w-[500px]">
          
          {/* HEADER */}
          <DialogHeader className="border-b px-6 py-4">
            <DialogTitle>
              New Habit
            </DialogTitle>

            <DialogDescription>
              Build habits to improve your Pathetic life
            </DialogDescription>
          </DialogHeader>

          {/* SCROLLABLE CONTENT */}
          <div className="flex-1 px-6 py-4">
            <form
              id="habit-form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-y-4"
            >
              <Controller
                name="name"
                control={control}
                render={({
                  field,
                  fieldState,
                }) => (
                  <Field
                    data-invalid={
                      fieldState.invalid
                    }
                  >
                    <HabitNamePicker
                      value={field.value}
                      onChange={field.onChange}
                      icon={watchedIcon}
                      color={watchedColor}
                      onIconChange={(
                        icon
                      ) =>
                        setValue(
                          "icon",
                          icon
                        )
                      }
                      onColorChange={(
                        color
                      ) =>
                        setValue(
                          "color",
                          color
                        )
                      }
                    />

                    {fieldState.invalid && (
                      <FieldError
                        errors={[
                          fieldState.error,
                        ]}
                      />
                    )}
                  </Field>
                )}
              />

              <SettingRow label="Goal">
                <GoalRow
                  control={control}
                />
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

          {/* FOOTER */}
          <DialogFooter className="border-t px-6 py-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                reset(defaultValues)
              }
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