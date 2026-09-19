"use client";

import { usehabitViewLayoutStore } from "@/store/use-habit-layout-store";
import { Button } from "./ui/button";

import { Grid, List } from "lucide-react";
import { ButtonGroup } from "./ui/button-group";


export const GridListTogle = () => {

  const { habitViewLayout, setHabitViewLayout } = usehabitViewLayoutStore();

  return (
    <div className="flex rounded-md border border-black/10 bg-zinc-100 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <ButtonGroup>
        <Button 
          variant="ghost"
          size={"sm"} 
          className={`h-7 gap-1.5 rounded-[5px] border-0 px-2.5 text-xs shadow-none ${
            habitViewLayout === "grid"
              ? "bg-blue-600 text-white hover:bg-blue-500 hover:text-white"
              : "text-muted-foreground hover:bg-white hover:text-foreground dark:hover:bg-white/5"
          }`}
          onClick={() => setHabitViewLayout("grid")}>
          <Grid className="h-3.5 w-3.5" /> <p>Grid</p>
        </Button>
        <Button
          variant="ghost"
          size={"sm"} 
          className={`h-7 gap-1.5 rounded-[5px] border-0 px-2.5 text-xs shadow-none ${
            habitViewLayout === "list"
              ? "bg-blue-600 text-white hover:bg-blue-500 hover:text-white"
              : "text-muted-foreground hover:bg-white hover:text-foreground dark:hover:bg-white/5"
          }`}
          onClick={() => setHabitViewLayout("list")}>
          <List className="h-3.5 w-3.5" /> <p>List</p>
        </Button>
      </ButtonGroup>
    </div>
  );
};
