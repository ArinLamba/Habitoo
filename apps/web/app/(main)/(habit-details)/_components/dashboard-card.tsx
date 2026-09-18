import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className: string;
};

export const DashboardCard = ({ children, className }: Props) => {
  return (
    <div className={cn(
      "group/card flex flex-col gap-4 overflow-hidden rounded-lg bg-card p-2 py-4 text-sm text-card-foreground ring-1 ring-foreground/10 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-lg *:[img:last-child]:rounded-b-lg", 
      className
    )}>
      {children}
    </div>
  );
};
