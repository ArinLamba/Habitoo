
export const Card = ({ label, value }: { label: string; value: string }) => (
  <div className="p-4 rounded-lg border bg-white shadow-md dark:bg-zinc-900">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);