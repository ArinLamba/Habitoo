import { FeedWrapper } from "@/components/layout/feed-wrapper";

import { getCompletionsByHabitId, getHabitById } from "@/db/queries";

import { HabitOverview } from "./_components/habit-overview";
import { buildHabitStats } from "@/lib/build-habit-stats";

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
  const completionsData = getCompletionsByHabitId(habitId, range);
  
  const [
    habit,
    completions
  ] = await Promise.all([
    habitData,
    completionsData
  ]);

  if(!habit) return null;

  const stats = buildHabitStats(habit, completions);

  return (
    <div className="">
      <FeedWrapper>
        <HabitOverview 
          habit={habit} 
          stats={stats}
        />
      </FeedWrapper>

      {/* <StickyWrapper>
        <StickyWrapperClient />
      </StickyWrapper> */}
    </div>
  );
};

export default HabitPage;