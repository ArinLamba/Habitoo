import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";

import { 
  getCompletions, 
  getHabits 
} from "@/db/queries";

import { HabitsClient } from "./habits-client";

import { StickyWrapperClient } from "@/components/sticky-wrapper-client";
import { MobileHabitDrawer } from "@/components/mobile-habit-drawer";

export default async function HabitsPage () {
  const habitsData = getHabits();
  const completionData = getCompletions();
  console.log("🚨 PAGE RENDER", new Date().toISOString());

  const [
    habits,
    completions
  ] = await Promise.all([
    habitsData,
    completionData
  ]);

  return (
    <div className="flex flex-row gap-x-[20px] px-6 ">
      <FeedWrapper>
        <HabitsClient 
          habits={habits}
          completions={completions}
        />
      </FeedWrapper>

      <StickyWrapper>
        <div className="hidden lg:block">
          <StickyWrapperClient habits={habits}/>
        </div>
        <MobileHabitDrawer habits={habits} />
      </StickyWrapper>
      
    </div>
  );
};