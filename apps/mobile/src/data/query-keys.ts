export const queryKeys = {
  habits: ["habits"] as const,
  habit: (habitId: string) => ["habits", habitId] as const,
  completions: (range: number | "all", today?: string) =>
    ["completions", range, today] as const,
  habitCompletions: (habitId: string, range: number | "all", today?: string) =>
    ["habits", habitId, "completions", range, today] as const,
  habitLogs: (habitId: string) => ["habits", habitId, "logs"] as const,
  notes: (date: string) => ["notes", date] as const,
};
