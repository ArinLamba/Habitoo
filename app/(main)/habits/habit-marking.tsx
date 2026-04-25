
import { Header } from "./header";
import { TickBox } from "./tick-box";
import { Habit } from "@/lib/types";


type Props = {
  habits: Habit[];
};

export const HabitMarking = ({ 
  habits, 
  
 }: Props) => {


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