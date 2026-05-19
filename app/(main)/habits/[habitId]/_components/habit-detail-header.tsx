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
    <div className="">
      <ButtonGroup className="justify-between w-full">
        <Button 
          
          variant={selectedTab === "LogHistory" ? "default" : "ghost"}
          size={"sm"} className="gap-2 w-1/3"
          onClick={() => setSelectedTab("LogHistory")}
        >
          <p>Log History</p>
        </Button>
        <Button
          variant={selectedTab === "Notes" ? "default" : "ghost"}  
          size={"sm"} className="gap-2 w-1/3" 
          onClick={() => setSelectedTab("Notes")}
        >
          <p>Notes</p>
        </Button>
        <Button 
          variant={selectedTab === "About" ? "default" : "ghost"}  
          size={"sm"} className="gap-2 w-1/3" 
          onClick={() => setSelectedTab("About")}
        >
          <p>About</p>
        </Button>
      </ButtonGroup>
    </div>
  );
};