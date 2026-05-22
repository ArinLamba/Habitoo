
export const HabitCardFooter = () => {
  return (
    <div className="flex gap-4 ml-1 mt-6">
      <div className="flex gap-2  items-center justify-center">
        <div className="h-3 w-3 rounded-full bg-emerald-500" />
        <p className="text-xs text-muted-foreground mt-0.5">Completed</p>
      </div>
      <div className="flex gap-2  items-center justify-center">
        <div className="h-3 w-3 rounded-full border border-zinc-400" />
        <p className="text-xs text-muted-foreground mt-0.5">Not Done</p>
      </div>
      <div className="flex gap-2  items-center justify-center">
        <div className="h-3 w-3 rounded-full border-dashed border border-rose-400" />
        <p className="text-xs text-muted-foreground mt-0.5">Future</p>
      </div>
      <div className="flex gap-2  items-center justify-center">
        <div className="h-3 w-3 rounded-full border-dashed border bg-rose-700/60" />
        <p className="text-xs text-muted-foreground mt-0.5">Before Habit Created</p>
      </div>
    </div>
  );
};