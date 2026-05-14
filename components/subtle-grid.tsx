import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  opacity?: number;
};

export const SubtleGrid = ({ className, opacity = 0.04 }: Props) => {
  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none",
        "bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]",
        "bg-[size:24px_24px]",
        className
      )}
      style={{ opacity }}
    />
  );
};