import { useViewStore } from "@/store/use-view-store";
import { Button } from "../ui/button";

export const HabitHeader = () => {

  const { view, setView } = useViewStore();
  return (
    <div className="flex gap-2 mb mx-auto">
        <Button
          onClick={() => setView("heatmap")}
          variant={view === "heatmap" ? "default" : "secondary"}
        >
          HeatMap
        </Button>

        <Button
          onClick={() => setView("habit")}
          variant={view === "habit" ? "default" : "secondary"}
        >
          Habits
        </Button>
      </div>
  );
};
