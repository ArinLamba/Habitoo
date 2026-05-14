
import { Habit, HabitStats } from "@/lib/types";

import { StreakCard } from "./streak-card";
import { StatsCards } from "./stats-card";
import { HabitHeader } from "./habit-header";
import { HabitCalendar } from "./habit-calendar";
import { DashboardCard } from "./dashboard-card";
import { StreakTimeline } from "./streak-timeline";
import { AnalyticsChart } from "./analytics-chart";

type Props = {
  habit: Habit;
  stats: HabitStats;
}


export const HabitOverview = ({ habit, stats }: Props) => {

  if(!stats) return null;

  return (
    <div className="space-y-3">
      <HabitHeader habit={habit}/>

      <div className="grid grid-cols-12 gap-2">
        {/* Left streak card */}
        <DashboardCard className="col-span-3">
          <StreakCard
            currentStreak={stats?.currentStreak}
            completedDates={stats?.completionMap}
          />
        </DashboardCard>

        {/* Right side */}
        <DashboardCard className="col-span-9 space-y-4">
          <StatsCards />
          <HabitCalendar />
        </DashboardCard>

        {/* Bottom section */}
        <DashboardCard className="col-span-6">
          <StreakTimeline />
        </DashboardCard>

        <DashboardCard className="col-span-6">
          <AnalyticsChart />
        </DashboardCard>
      </div>
    </div>
  );
};