import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className: string;
};

export const DashboardCard = ({ children, className }: Props) => {
  return (
    <div className={cn(
      "rounded-xl border border-black/10 dark:border-white/10 dark:bg-zinc-800/40 p-2 shadow-lg", 
      className
    )}>
      {children}
    </div>
  );
};