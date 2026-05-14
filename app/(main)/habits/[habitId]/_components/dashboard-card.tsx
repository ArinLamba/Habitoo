import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className: string;
};

export const DashboardCard = ({ children, className }: Props) => {
  return (
    <div className={cn(
      "rounded-xl border bg-zinc-900/80 p-4 shadow-sm", 
      className
    )}>
      {children}
    </div>
  );
};