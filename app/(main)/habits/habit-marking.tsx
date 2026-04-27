
import { useHabitStore } from "@/store/use-habit-store";
import { Header } from "./header";
import { TickBox } from "./tick-box";



export const HabitMarking = () => {

  const habits = useHabitStore((s) => s.habits);

  return (
    
    <div className=" ml-3 overflow-x-auto scrollbar-thin ">
      <Header />
      {/* GRID ROWS */}
      {habits.map((habit) => (
        <TickBox 
          key={habit.id} 
          habit={habit}
        />
      ))}

    </div>
  );
};