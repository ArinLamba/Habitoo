import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { UNIT_GROUPS } from "@/lib/constants"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function UnitPicker({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="justify-between min-w-[120px]"
        >
          {value ? value : UNIT_GROUPS[0].units[0]}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput 
            placeholder="Search or add unit..." 
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty className="p-1">
               <Button 
                variant="ghost" 
                className="w-full justify-start text-xs font-normal"
                onClick={() => {
                  onChange(searchValue)
                  setOpen(false)
                }}
              >
                <Plus className="mr-2 h-3 w-3" />
                Add &quot;{searchValue}&quot;
              </Button>
            </CommandEmpty>
            {UNIT_GROUPS.map((group) => (
              <React.Fragment key={group.label}>
                <CommandGroup heading={group.label}>
                  {group.units.map((unit) => (
                    <CommandItem
                      key={unit}
                      value={unit}
                      onSelect={(currentValue) => {
                        onChange(currentValue)
                        setOpen(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", value === unit ? "opacity-100" : "opacity-0")} />
                      {unit}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </React.Fragment>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};