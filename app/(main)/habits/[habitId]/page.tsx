import { FeedWrapper } from "@/components/layout/feed-wrapper";

import { getCompletionsByHabitId, getHabitById, getHabitLogs } from "@/db/queries";

import { HabitOverview } from "./_components/habit-overview";
import { buildHabitStats } from "@/lib/build-habit-stats";


import { HabitDetailsPanel } from "./_components/habit-detail-panel";

import { DetailPanelWrapper } from "@/components/layout/detail-panel-wrapper";

type Props = {
  params: {
    habitId: string;
  };

  searchParams: {
    range?: string;
  };
};

const HabitPage = async ({ params, searchParams  }: Props) => {
  const { habitId } = await params;
  const resolvedSearchParams = await searchParams;

  const range =
    resolvedSearchParams.range === "all"
      ? "all"
      : Number(resolvedSearchParams.range) || 90;
  
  const habitData = getHabitById(habitId);
  const logsData = getHabitLogs(habitId);
  const completionsData = getCompletionsByHabitId(habitId, range);
  
  const [
    habit,
    completions,
    logs,
  ] = await Promise.all([
    habitData,
    completionsData,
    logsData
  ]);

  if(!habit) return null;

  const analytics = buildHabitStats(habit, completions);
  if(!analytics) return null;

  return (
    <div className="">
      <FeedWrapper>
        <HabitOverview 
          habit={habit} 
          analytics={analytics}
          completions={completions}
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
