import { getHabits, getCompletions } from "@/db/queries";


import { StickyWrapper } from "@/components/sticky-wrapper";

import { FeedWrapper } from "@/components/feed-wrapper";
import { StatsClient } from "./stats-client";
import { StickyWrapperClient } from "@/components/sticky-wrapper-client";

const StatsPage = async () => {

  const habitsData = getHabits();
  const completionData = getCompletions();

  const [
    habits,
    completions
  ] = await Promise.all([
    habitsData,
    completionData
  ]);
  return (
    <div className="flex  gap-[20px] px-6 ">
      <FeedWrapper>
        <StatsClient 
          habits={habits}
          completions={completions}
        />
      </FeedWrapper>
      <StickyWrapper>
        <StickyWrapperClient habits={habits} />
      </StickyWrapper>
    </div>
  );
};

export default StatsPage;