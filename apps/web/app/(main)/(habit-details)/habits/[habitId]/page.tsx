import { FeedWrapper } from "@/components/layout/feed-wrapper";
import { DetailPanelWrapper } from "@/components/layout/detail-panel-wrapper";

import { getCompletionsByHabitId, getHabitById, getHabitLogs } from "@/db/queries";

import { HabitOverview } from "../../_components/habit-overview";
import { buildHabitStats } from "@/lib/build-habit-stats";
import { HabitDetailsPanel } from "../../_components/habit-detail-panel";
import { HabitHeader } from "../../_components/habit-header";


type Props = {
  params: Promise<{
    habitId: string;
  }>;

  searchParams: Promise<{
    range?: string;
  }>;
};

const HabitPage = async ({ params, searchParams  }: Props) => {
  const { habitId } = await params;
  const resolvedSearchParams = await searchParams;

  const heatmapRange =
    resolvedSearchParams.range === "all"
      ? "all"
      : Number(resolvedSearchParams.range) || 365;
  
  const habitData = getHabitById(habitId);
  const logsData = getHabitLogs(habitId);
  const completionsData = getCompletionsByHabitId(habitId, "all");
  const heatmapCompletionsData = getCompletionsByHabitId(habitId, heatmapRange);
  
  const [
    habit,
    completions,
    logs,
    heatmapCompletions,
  ] = await Promise.all([
    habitData,
    completionsData,
    logsData,
    heatmapCompletionsData,
  ]);

  if(!habit) return null;

  const analytics = buildHabitStats(habit, completions);
  if(!analytics) return null;

  return (
    <div className="space-y-2">
      <HabitHeader 
        habit={habit} 
        logs={logs}
      />
      <FeedWrapper>
        <HabitOverview 
          habit={habit} 
          analytics={analytics}
          completions={completions}
          heatmapCompletions={heatmapCompletions}
        />
      </FeedWrapper>

      <DetailPanelWrapper>
        <HabitDetailsPanel
          habit={habit}
          logs={logs}
        />
      </DetailPanelWrapper>
    </div>
  );
};

export default HabitPage;
