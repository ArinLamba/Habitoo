import { ICON_MAP } from "@/lib/habit-icons";
import { SUGGESTED_HABITS } from "@/lib/suggested-habits";
import type { SuggestedHabit } from "@habitoo/core";

import {
  Command,
  CommandEmpty,
  CommandGroup,

  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input";
import React from "react";
import { HabitIconPicker } from "./habit-icon-picker";
import { Search } from "lucide-react";


type Props = { 
  value: string, 
  onChange: (val: string) => void,
  icon: string,
  color: string,
  onIconChange: (icon: string) => void,
  onColorChange: (color: string) => void,
  onSuggestionSelect?: (habit: SuggestedHabit) => void
};

export const HabitNamePicker = ({ 
  value, 
  onChange, 
  icon, 
  color, 
  onIconChange, 
  onColorChange,
  onSuggestionSelect,
}: Props) => {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex items-center w-full h-11 pr-2 rounded-md border border-input focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2 transition-all group">
      
      {/* 1. Icon Picker as a Prefix */}
      <HabitIconPicker
        selectedIcon={icon}
        selectedColor={color}
        onIconChange={onIconChange}
        onColorChange={onColorChange}
        isNested // Tells the picker to hide its own borders
      />

      {/*  Divider */}
      <div className="h-6 w-[2px] bg-border mr-3 shrink-0" />

      {/* 2. The Popover/Input Combo */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex-1 flex items-center h-full cursor-text">
            <Input 
              value={value} 
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter Habit Name"
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-full w-full bg-transparent p-0 shadow-none text-base text-sm dark:bg-transparent" 
              onClick={() => setOpen(true)}
            />
            <Search className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-(--radix-popover-trigger-width) max-h-[min(360px,var(--radix-popover-content-available-height))] overflow-y-auto overscroll-contain p-0 touch-pan-y" 
          align="start"
          sideOffset={6}
          onWheelCapture={(e) => e.stopPropagation()}
          onTouchMoveCapture={(e) => e.stopPropagation()}
        >
          <Command>
            <CommandList className="max-h-[320px] overflow-y-auto overscroll-contain touch-pan-y">
              <CommandEmpty className="p-2 text-xs text-muted-foreground">
                Press enter to use &quot;{value}&quot;
              </CommandEmpty>
              {SUGGESTED_HABITS.map((group) => (
                <React.Fragment key={group.label}>
                  <CommandGroup heading={group.label}>
                    {group.habits.map((habit) => {
                      const SuggestionIcon = ICON_MAP[habit.icon] || ICON_MAP.Plus;
                      const habitColor = habit.color ?? color;
                      return (
                        <CommandItem
                          key={habit.name}
                          value={habit.name}
                          onSelect={() => {
                            onSuggestionSelect?.(habit);
                            onChange(habit.name);
                            onIconChange(habit.icon);
                            onColorChange(habit.color ?? color);
                            setOpen(false);
                          }}
                          className="gap-x-4"
                        >
                          <div className="">
                            <SuggestionIcon className="size-5" color={habitColor} />
                          </div>
                          <div>
                            <p>{habit.name}</p>
                            <p className="text-muted-foreground text-xs">{habit.targetValue ?? 1} {habit.unit ?? "times"} </p>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                  <CommandSeparator />
                </React.Fragment>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

