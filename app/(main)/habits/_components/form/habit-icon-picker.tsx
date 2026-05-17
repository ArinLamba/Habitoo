"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  HabitIconName,
  ICON_CATEGORIES,
  ICON_MAP,
  HABIT_COLORS
} from "@/lib/habit-icons";


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
  const IconComponent = (ICON_MAP[selectedIcon as HabitIconName] ) || ICON_MAP.Plus;

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
      
      <PopoverContent 
        className="w-72 p-3 shadow-xl animate-in fade-in zoom-in-95" 
        align="start"
        onWheel={(e) => e.stopPropagation()}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-muted-foreground">Appearance</h4>
            <div 
              className="h-2 w-2 rounded-full animate-pulse" 
              style={{ backgroundColor: selectedColor }} 
            />
          </div>
          
          {/* Color Selection */}
          <div className="grid grid-cols-7 gap-2 px-1">
            {HABIT_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                className={cn(
                  "h-4 w-4 rounded-full border-2 transition-all hover:scale-110 active:scale-95",
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
          <div className="max-h-56 pr-1">
            {/* Icon Selection Grid */}
            <div
              className="
                max-h-56
                overflow-y-auto
                pr-1
                scrollbar-thin
                scrollbar-thumb-black
                overscroll-contain
              "
              onWheel={(e) => e.stopPropagation()}
            >
              <div>
                {ICON_CATEGORIES.map((category) => (
                  <div key={category.label} >
                    
                    <div className="sticky top-0 z-10 bg-popover py-1 text-xs font-medium text-muted-foreground">
                      {category.label}
                    </div>

                    <div className="grid grid-cols-6">
                      {category.icons.map((item) => {
                        const ItemIcon = item.icon;
                        const isActive = selectedIcon === item.name;

                        return (
                          <Button
                            key={item.name}
                            type="button"
                            variant="ghost"
                            className={cn(
                              "h-10 w-10 p-0 transition-colors",
                              isActive
                                ? "bg-accent text-accent-foreground"
                                : "hover:bg-muted"
                            )}
                            onClick={() => onIconChange(item.name)}
                          >
                            <ItemIcon
                              size={22}
                              style={{ color: selectedColor }}
                            />
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};