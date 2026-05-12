"use client";

import { usehabitViewLayoutStore } from "@/store/use-habit-layout-store";
import { Button } from "./ui/button";

import { Grid, List } from "lucide-react";
import { ButtonGroup } from "./ui/button-group";

export const GridListTogle = () => {

  const { habitViewLayout, setHabitViewLayout } = usehabitViewLayoutStore();

  return (
    <div className="flex">
      <ButtonGroup >
        <Button variant="outline" size={"sm"} className="gap-2" onClick={() => setHabitViewLayout("grid")}>
          <Grid/> <p>Grid</p>
        </Button>
        <Button variant="outline" size={"sm"} className="gap-2" onClick={() => setHabitViewLayout("list")}>
          <List /> <p>List</p>
        </Button>
      </ButtonGroup>
    </div> 
  );
};
