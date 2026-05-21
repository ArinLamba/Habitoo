import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  opacity?: number;
}
const cells = [
  { col: 1, row: 4, tone: "bg-amber-600/20" },
  { col: 2, row: 7, tone: "bg-amber-600/20" },
  { col: 3, row: 3, tone: "bg-amber-100/10" },
  { col: 3, row: 5, tone: "bg-orange-600/20" },
  { col: 4, row: 6, tone: "bg-orange-200/16" },
  { col: 5, row: 6, tone: "bg-orange-200/20" },
  { col: 6, row: 7, tone: "bg-amber-600/20" },
  { col: 7, row: 5, tone: "bg-amber-600/20" },
  { col: 7, row: 8, tone: "bg-orange-600/20" },
  { col: 8, row: 6, tone: "bg-amber-100/12" },
  { col: 9, row: 4, tone: "bg-orange-200/14"},
  { col: 10, row: 5, tone: "bg-amber-600/16"},
  { col: 11, row: 6, tone: "bg-orange-600/14"},
  { col: 3, row: 1, tone: "bg-orange-600/30" },
  { col: 11, row: 3, tone: "bg-orange-600/30" },
  { col: 9, row: 2, tone: "bg-orange-600/30" },
  { col: 10, row: 1, tone: "bg-orange-600/30" },

];

export const SubtleGrid = ({ className, opacity = 0.04 }: Props) => {
  const visualOpacity = Math.min(Math.max(opacity * 6, 0.18), 0.55);

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden bg-zinc-950/25",
        className
      )}
      style={{ opacity: visualOpacity }}
>
      <div
        className={cn(
          "absolute inset-0",
          "bg-[linear-gradient(to_right,rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.14)_1px,transparent_1px)]",
          "bg-[size:26px_26px]",
          "[mask-image:linear-gradient(to_bottom,transparent_0%,black_22%,black_70%,transparent_96%)]"
        )}
      />

      <div
        className={cn(
          "absolute inset-x-2 top-16 grid grid-cols-12 grid-rows-8",
          "h-[210px] [mask-image:radial-gradient(ellipse_at_center,black_0%,black_62%,transparent_100%)]"
        )}
      >
        {cells.map((cell) => (
          <div
            key={`${cell.col}-${cell.row}`}
            className={cn("border border-white/[0.025]", cell.tone)}
            style={{
              gridColumn: cell.col,
              gridRow: cell.row,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-x-0 top-12 h-48 bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.18),transparent_62%)]" />
    </div>
  );
};
