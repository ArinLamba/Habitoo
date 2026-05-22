export const queryKeys = {
  habits: ["habits"] as const,
  completions: (range: number | "all") => ["completions", range] as const,
  notes: (date: string) => ["notes", date] as const,
};
