
import { Completion, Habit, HabitStats } from "@/lib/types";

import { StreakCard } from "./streak-card";
import { StatsCards } from "./stats-cards";
import { HabitHeader } from "./habit-header";
import { HabitCalendar } from "./habit-calendar";
import { DashboardCard } from "./dashboard-card";
import { StreakTimeline } from "./streak-timeline";
import { AnalyticsChart } from "./analytics-chart";

type Props = {
  habit: Habit;
  analytics: HabitStats;
  completions: Completion[];
}


export const HabitOverview = ({ habit, analytics, completions }: Props) => {

  if(!analytics) return null;

  return (
    <div className="space-y-3 w-full bg-ambr-600">
      <HabitHeader habit={habit}/>

      <div className=" flex flex-col gap-2 w-full">
        {/* TOP SECTION */}
        <div className="flex flex-col lg:flex-row justify-center w-full gap-2">

          <DashboardCard className="p-0 lg:w-1/3 w-full">
            <StreakCard
              frequency={habit.frequency}
              currentStreak={analytics.streaks.currentStreak}
              calendar={analytics.calendar.sets}
            />
          </DashboardCard>
          
          <div className="w-full flex flex-col gap-2">
            <StatsCards 
              habit={habit}
              analytics={analytics}
            />
            <DashboardCard className="w-full">
              <HabitCalendar 
                habit={habit}
                color={habit.color!}
                calendar={analytics.calendar.sets}
                completions={completions}
                />
            </DashboardCard>
          </div>

        </div>

        {/* BOTTOM SECTION */}

        <div className="flex flex-col lg:flex-row w-full bg-aber-300 gap-2">

          <DashboardCard className="w-full">
            <StreakTimeline 
              frequency={habit.frequency}
              color={habit.color!}
              timeline={analytics.streaks.timeline}
            />
          </DashboardCard>

          <DashboardCard className="col-span-6 p-0 w-full">
            <AnalyticsChart 
              color={habit.color!}
              charts={analytics.charts} 
            />
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};
