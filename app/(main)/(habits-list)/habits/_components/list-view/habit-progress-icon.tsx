type HabitProgressIconProps = {
  color?: string | null;
  percentage: number;
  currentStreak: number;
  IconComponent: React.ElementType;
};

export const HabitProgressIcon = ({
  color,
  percentage,
  currentStreak,
  IconComponent,
}: HabitProgressIconProps) => {
  const safeColor = color ?? "#22c55e";
  const radius = 20;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-12 w-12">
        <svg
          className="absolute inset-0 h-12 w-12 -rotate-90"
          viewBox="0 0 48 48"
        >
          <circle
            cx="24"
            cy="24"
            r={radius}
            className="stroke-black/10 dark:stroke-white/10"
            strokeWidth="3"
            fill="none"
          />

          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke={safeColor}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={
              circumference - (circumference * percentage) / 100
            }
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{
              backgroundColor: `${safeColor}15`,
            }}
          >
            <IconComponent color={safeColor} size={22} />
          </div>
        </div>
      </div>

      <span
        className="mt-1 text-[11px] font-semibold leading-none"
        style={{ color: safeColor }}
      >
        {currentStreak}
      </span>
    </div>
  );
};