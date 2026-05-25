"use client";

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

import { HabitNamePicker } from "@/app/(main)/(habits-list)/habits/_components/form/habit-name-picker";
import { GoalRow } from "@/app/(main)/(habits-list)/habits/_components/form/goal-row";
import { SettingRow } from "@/app/(main)/(habits-list)/habits/_components/form/setting-row";

import {
  formSchema,
  HabitFormValues,
} from "@/lib/types";
import type { SuggestedHabit } from "@habitoo/core";

import { useCreateHabit } from "@/hooks/mutations/use-create-habit";

type Props = {
  variant?: "row" | "icon";
};

export const AddHabitInput = ({ variant = "row" }: Props) => {
  const [open, setOpen] = useState(false);

  const { mutate: createMutate } = useCreateHabit();

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

  const applySuggestion = (suggested: SuggestedHabit) => {
    setValue("name", suggested.name, { shouldDirty: true, shouldValidate: true });
    setValue("icon", suggested.icon, { shouldDirty: true, shouldValidate: true });
    setValue("color", suggested.color ?? watchedColor, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("targetValue", suggested.targetValue ?? 1, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("unit", suggested.unit ?? "times", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("frequency", suggested.frequency ?? "day", {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = (data: HabitFormValues) => {
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
    <div className={variant === "row" ? "flex-1 border-b p-2 text-xs" : ""}>
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger asChild>
          <button
            className={
              variant === "icon"
                ? "flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "flex items-center gap-2 font-semibold text-blue-700 dark:text-indigo-400"
            }
            aria-label="Add habit"
          >
            <Plus size={variant === "icon" ? 28 : 18} />
            {variant === "row" && <p>Add Habit</p>}
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
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-4">
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
                      onSuggestionSelect={applySuggestion}
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
          <DialogFooter className=" px-8  pb-8">
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
              style={{ backgroundColor: watchedColor }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
