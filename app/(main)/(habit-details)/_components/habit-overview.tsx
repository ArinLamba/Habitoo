
import { Completion, Habit, HabitStats } from "@/lib/types";

import { StreakCard } from "./streak-card";
import { StatsCards } from "./stats-cards";

import { HabitCalendar } from "./habit-calendar";
import { DashboardCard } from "./dashboard-card";
import { StreakTimeline } from "./streak-timeline";
import { AnalyticsChart } from "./analytics-chart";
import { Heatmap } from "@/components/heatmap";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type Props = {
  habit: Habit;
  analytics: HabitStats;
  completions: Completion[];
  heatmapCompletions: Completion[];
}


export const HabitOverview = ({
  habit,
  analytics,
  completions,
  heatmapCompletions,
}: Props) => {

  if(!analytics) return null;

  return (
    <div className="space-y-3 w-full bg-ambr-600">

      <div className=" flex flex-col gap-2 w-full">
        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row justify-center w-full gap-2">

          <DashboardCard className="p-0 lg:w-1/3 max-w-full">
            <StreakCard
              frequency={habit.frequency}
              color={habit.color!}
              currentStreak={analytics.streaks.currentStreak}
              calendar={analytics.calendar.sets}
            />
          </DashboardCard>
          
          <div className="w-full flex flex-col gap-2">
            <StatsCards 
              habit={habit}
              analytics={analytics}
            />
            <DashboardCard className="w-full overflow-hidden">
              <Tabs defaultValue="calendar" className="gap-2">
                <div className="flex items-center justify-between px-1">
                  <p className="text-sm font-semibold">
                    History
                  </p>
                  <TabsList>
                    <TabsTrigger value="calendar">
                      Calendar
                    </TabsTrigger>
                    <TabsTrigger value="heatmap">
                      Heatmap
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="calendar">
                  <HabitCalendar 
                    habit={habit}
                    color={habit.color!}
                    calendar={analytics.calendar.sets}
                    completions={completions}
                  />
                </TabsContent>

                <TabsContent value="heatmap" className="overflow-x-auto">
                  <Heatmap
                    habits={[habit]}
                    habit={habit}
                    completions={heatmapCompletions}
                    days={365}
                    title="Habit heatmap (Last 1 year)"
                  />
                </TabsContent>
              </Tabs>
            </DashboardCard>
          </div>

        </div>

        {/* BOTTOM SECTION */}

        <div className="flex flex-col md:flex-row w-full bg-aber-300 gap-2">

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
              frequency={habit.frequency}
              charts={analytics.charts} 
            />
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};
