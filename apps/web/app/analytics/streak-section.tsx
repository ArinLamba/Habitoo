
type Props = {
  currentStreak: number;
  bestStreak: number;
}
export const StreakSection = ({ 
  currentStreak,
  bestStreak
 }: Props ) => {


  return (
    <div className="p-4 rounded-lg border bg-white shadow-md dark:bg-zinc-900">
      <p className="text-sm text-muted-foreground mb-3">🔥 Streaks</p>

      <div className="flex gap-10">
        <Stat label="Current" value={`${currentStreak} days`} />
        <Stat label="Best" value={`${bestStreak} days`} />
      </div>
    </div>
  );
};

type StatProps = {
  label: string;
  value: string;
};

const Stat = ({ label, value }: StatProps) => (
  <div>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);