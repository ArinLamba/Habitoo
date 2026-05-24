import type { Habit } from "@habitoo/core";
import { Flame, Trophy } from "lucide-react-native";
import { Text, View } from "react-native";

import type { HabitAnalytics } from "./types";

type StreakTimelineProps = {
  analytics: HabitAnalytics;
  color: string;
  frequency: Habit["frequency"];
};

type StreakSegment = HabitAnalytics["streaks"]["timeline"]["recent"][number];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
});

const formatSegmentDate = (date: string) =>
  dateFormatter.format(new Date(`${date}T00:00:00`));

function StreakBar({
  color,
  frequency,
  maxLength,
  segment,
}: {
  color: string;
  frequency: Habit["frequency"];
  maxLength: number;
  segment: StreakSegment;
}) {
  const widthPercent = (segment.length / maxLength) * 100;
  const width = `${Math.max(widthPercent, 18)}%` as const;
  const Icon = segment.isBest ? Trophy : Flame;

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between px-1">
        <Text className="text-xs font-semibold text-zinc-500">
          {formatSegmentDate(segment.start)}
        </Text>
        <Text className="text-xs font-semibold text-zinc-500">
          {formatSegmentDate(segment.end)}
        </Text>
      </View>

      <View
        className="h-8 overflow-hidden rounded-lg"
        style={{ backgroundColor: `${color}18` }}
      >
        <View
          className="h-full flex-row items-center justify-center gap-2 rounded-lg"
          style={{
            width,
            backgroundColor: color,
            shadowColor: segment.isBest ? color : "transparent",
            shadowOpacity: segment.isBest ? 0.35 : 0,
            shadowRadius: 12,
          }}
        >
          <Icon color="#fff" fill="#fff" size={15} />
          <Text className="text-sm font-extrabold text-white">
            {segment.length} {frequency}
          </Text>
        </View>
      </View>
    </View>
  );
}

export function StreakTimeline({
  analytics,
  color,
  frequency,
}: StreakTimelineProps) {
  const timeline = analytics.streaks.timeline;
  const hasRecent = timeline.recent.length > 0;
  const hasTop = timeline.top.length > 0;
  const allStreaks = [...timeline.recent, ...timeline.top];
  const maxLength = Math.max(...allStreaks.map((segment) => segment.length), 1);

  if (!hasRecent && !hasTop) {
    return (
      <View className="h-40 items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/50">
        <Text className="text-sm font-semibold text-zinc-500">
          No streak history yet
        </Text>
      </View>
    );
  }

  return (
    <View className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5">
      {hasRecent ? (
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-extrabold text-white">
              Recent streaks
            </Text>
            {timeline.hidden > 0 ? (
              <Text className="text-xs font-bold text-zinc-500">
                +{timeline.hidden} more
              </Text>
            ) : null}
          </View>

          <View className="gap-3">
            {timeline.recent.map((segment, index) => (
              <StreakBar
                color={color}
                frequency={frequency}
                key={`${segment.start}-${index}`}
                maxLength={maxLength}
                segment={segment}
              />
            ))}
          </View>
        </View>
      ) : null}

      {hasTop ? (
        <View className={`${hasRecent ? "mt-6" : ""} gap-3`}>
          <Text className="text-base font-extrabold text-white">Top streaks</Text>
          <View className="gap-3">
            {timeline.top.map((segment, index) => (
              <StreakBar
                color={color}
                frequency={frequency}
                key={`${segment.start}-${index}`}
                maxLength={maxLength}
                segment={segment}
              />
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}
