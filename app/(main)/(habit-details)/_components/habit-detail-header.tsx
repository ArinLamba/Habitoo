import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

type Props = {
  selectedTab: "LogHistory" | "Notes" | "About"
  setSelectedTab: (selectedTab: "LogHistory" | "Notes" | "About") => void;
};
export const HabitDetailsHeader = ({
  selectedTab,
  setSelectedTab
}: Props) => {

  return (
    <div className="sticky top-0 z-10 rounded-md border border-black/10 bg-zinc-50/95 p-1 backdrop-blur dark:border-white/10 dark:bg-zinc-900/95">
      <ButtonGroup className="w-full justify-between">
        <Button 
          
          variant={selectedTab === "LogHistory" ? "secondary" : "ghost"}
          size={"sm"} className="w-1/3 gap-2 text-xs"
          onClick={() => setSelectedTab("LogHistory")}
        >
          <p>Log History</p>
        </Button>
        <Button
          variant={selectedTab === "Notes" ? "secondary" : "ghost"}  
          size={"sm"} className="w-1/3 gap-2 text-xs" 
          onClick={() => setSelectedTab("Notes")}
        >
          <p>Notes</p>
        </Button>
        <Button 
          variant={selectedTab === "About" ? "secondary" : "ghost"}  
          size={"sm"} className="w-1/3 gap-2 text-xs" 
          onClick={() => setSelectedTab("About")}
        >
          <p>About</p>
        </Button>
      </ButtonGroup>
    </div>
  );
};
