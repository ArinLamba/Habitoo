import { format } from "date-fns";
import { Flame, Trophy } from "lucide-react";

import { StreakSegment } from "@/lib/build-streak-timeline";

type Props = {
  segment: StreakSegment;
  maxLength: number;

  color: string;
};

export const StreakBar = ({
  segment,
  maxLength,
  color,
}: Props) => {
  const widthPercent =
    (segment.length / maxLength) * 100;

  return (
    <div className="space-y-2">
      {/* Labels */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-medium text-muted-foreground">
          {format(
            new Date(segment.start),
            "MMM dd"
          )}
        </span>

        <span className="text-xs font-medium text-muted-foreground">
          {format(
            new Date(segment.end),
            "MMM dd"
          )}
        </span>
      </div>

      {/* Track */}
      <div
        className="relative h-7.5 w-full overflow-hidden rounded"
        style={{
          backgroundColor: `${color}15`,
        }}
      >
        {/* Fill */}
        <div
          className="relative flex h-full items-center justify-center rounded transition-all duration-500"
          style={{
            width: `${Math.max(widthPercent, 18)}%`,

            background: `
              linear-gradient(
                90deg,
                ${color},
                ${color}CC
              )
            `,

            boxShadow: segment.isBest
              ? `0 0 24px ${color}55`
              : undefined,
          }}
        >
          {/* Content */}
          <div className="flex items-center gap-x-2">
            {segment.isBest ? (
              <Trophy className="size-4 fill-white text-white" />
            ) : (
              <Flame className="size-4 fill-white text-white" />
            )}

            <span className="text-sm font-semibold dark:text-white">
              {segment.length} days
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};