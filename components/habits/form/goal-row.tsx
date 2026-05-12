"use client"

import { Control, Controller } from "react-hook-form"

import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { UnitPicker } from "./units-picker"
import React from "react"
import { HabitFormValues } from "@/lib/types"

interface Props {
  control: Control<HabitFormValues>
}

export const GoalRow = ({
  control,
}: Props) => {
  return (

    <div className="flex w-full gap-2">
      {/* TARGET */}

      <Controller
        name="targetValue"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="number"
            placeholder="1"
            className=""
          />
        )}
      />

      {/* UNIT */}

      <Controller
        name="unit"
        control={control}
        render={({ field }) => (
          <UnitPicker
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      {/* FREQUENCY */}

      <Controller
        name="frequency"
        control={control}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={field.onChange}
            
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Frequency" />
            </SelectTrigger>

            <SelectContent >
              <SelectItem value="day">
                Per Day
              </SelectItem>

              <SelectItem value="week">
                Per Week
              </SelectItem>

              <SelectItem value="month">
                Per Month
              </SelectItem>

              <SelectItem value="year">
                Per Year
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      />

      </div>
  )
}