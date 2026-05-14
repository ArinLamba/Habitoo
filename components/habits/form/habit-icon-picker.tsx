"use client"

import * as Icons from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { HABIT_COLORS, HABIT_ICONS } from "@/lib/constants"
import { LucideIconName } from "@/lib/types"

// 1. Define strict types for props
interface HabitIconPickerProps {
  selectedIcon: string
  selectedColor: string
  onIconChange: (name: string) => void
  onColorChange: (color: string) => void
  isNested?: boolean // Used to remove borders when inside an input
}

// 2. Icon & Color constants


export function HabitIconPicker({
  selectedIcon,
  selectedColor,
  onIconChange,
  onColorChange,
  isNested = false,
}: HabitIconPickerProps) {
  
  // Dynamically get the icon component from Lucide
  const IconComponent = (Icons[selectedIcon as LucideIconName] as React.ElementType) || Icons.Plus;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          type="button"
          className={cn(
            "h-9 w-10 p-0 shrink-0 transition-all rounded-md ",
            !isNested && "border-0 rounded-md shadow-sm"
          )}
          style={{ 
            color: selectedColor,
            borderColor: !isNested ? selectedColor : "transparent" 
          }}
        >
          <IconComponent className="h-5 w-5 stroke-[2.5px]" />
          <span className="sr-only">Pick icon and color</span>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-64 p-3 shadow-xl animate-in fade-in zoom-in-95" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-muted-foreground">Appearance</h4>
            <div 
              className="h-2 w-2 rounded-full animate-pulse" 
              style={{ backgroundColor: selectedColor }} 
            />
          </div>
          
          {/* Color Selection */}
          <div className="flex items-center justify-between px-1">
            {HABIT_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                className={cn(
                  "h-5 w-5 rounded-full border-2 transition-all hover:scale-110 active:scale-95",
                  selectedColor === c.value 
                    ? "border-primary ring-2 ring-primary/20 scale-110" 
                    : "border-transparent"
                )}
                style={{ backgroundColor: c.value }}
                onClick={() => onColorChange(c.value)}
              />
            ))}
          </div>

          <Separator className="opacity-50" />

          {/* Icon Selection Grid */}
          <div className="grid grid-cols-5 gap-1">
            {HABIT_ICONS.map((item) => {
              const ItemIcon = item.icon
              const isActive = selectedIcon === item.name
              
              return (
                <Button
                  key={item.name}
                  type="button"
                  variant="ghost"
                  className={cn(
                    "h-10 w-10 p-0 transition-colors",
                    isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                  )}
                  onClick={() => onIconChange(item.name)}
                >
                  <ItemIcon 
                    className="h-5 w-5" 
                    style={{ color: selectedColor }} 
                  />
                </Button>
              )
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};