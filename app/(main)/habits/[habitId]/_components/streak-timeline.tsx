import {
  StreakTimelineData,
} from "@/lib/build-streak-timeline";

import { StreakBar } from "./streak-bar";

type Props = {
  color: string;
  timeline: StreakTimelineData;
};

export const StreakTimeline = ({
  color,
  timeline,
}: Props) => {
  const hasRecent =
    timeline.recent.length > 0;

  const hasTop =
    timeline.top.length > 0;

  const allStreaks = [
    ...timeline.recent,
    ...timeline.top,
  ];

  const maxLength = Math.max(
    ...allStreaks.map((s) => s.length),
    1
  );

  if (!hasRecent && !hasTop) {
    return (
      <div className="flex h-40 items-center justify-center rounded-3xl border border-dashed text-sm text-muted-foreground">
        No streak history yet
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Recent */}
      {hasRecent && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">
              Recent Streaks
            </h3>

            {timeline.hidden > 0 && (
              <p className="text-xs text-muted-foreground">
                +{timeline.hidden} more streaks
              </p>
            )}
          </div>

          <div className="space-y-1">
            {timeline.recent.map(
              (segment, index) => (
                <StreakBar
                  key={`${segment.start}-${index}`}
                  segment={segment}
                  maxLength={maxLength}
                  color={color}
                />
              )
            )}
          </div>
        </div>
      )}

      {/* Top */}
      {hasTop && (
        <div className="space-y-5">
          <h3 className="text-sm font-semibold">
            Top Streaks
          </h3>

          <div className="space-y-5">
            {timeline.top.map(
              (segment, index) => (
                <StreakBar
                  key={`${segment.start}-${index}`}
                  segment={segment}
                  maxLength={maxLength}
                  color={color}
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};