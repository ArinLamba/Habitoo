
import { Completion } from "@/lib/types";
import { getSmartInsight } from "@/lib/helper";

export const SmartInsight = ({ completions }: {
  completions: Completion[];
}) => {

  const insight = getSmartInsight(completions);

  return (
    <div className="p-4 rounded-lg border shadow-md bg-white dark:bg-zinc-900">
      <p className="text-sm text-muted-foreground mb-2">
        🧠 Smart Insight
      </p>

      <p className="text-sm">
        {insight}
      </p>
    </div>
  );
};