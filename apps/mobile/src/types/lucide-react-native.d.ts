declare module "lucide-react-native" {
  import type { ComponentType } from "react";
  import type { SvgProps } from "react-native-svg";

  export type LucideProps = SvgProps & {
    absoluteStrokeWidth?: boolean;
    color?: string;
    size?: number | string;
    strokeWidth?: number | string;
  };

  export type LucideIcon = ComponentType<LucideProps>;

  export const Activity: LucideIcon;
  export const Archive: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const BarChart3: LucideIcon;
  export const BookOpenText: LucideIcon;
  export const Box: LucideIcon;
  export const CalendarDays: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Check: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const ClipboardList: LucideIcon;
  export const Eye: LucideIcon;
  export const EyeOff: LucideIcon;
  export const Flame: LucideIcon;
  export const GraduationCap: LucideIcon;
  export const Layers3: LucideIcon;
  export const Keyboard: LucideIcon;
  export const Lock: LucideIcon;
  export const Mail: LucideIcon;
  export const Menu: LucideIcon;
  export const Pencil: LucideIcon;
  export const PenLine: LucideIcon;
  export const Plus: LucideIcon;
  export const Ruler: LucideIcon;
  export const RotateCcw: LucideIcon;
  export const Search: LucideIcon;
  export const Settings: LucideIcon;
  export const SlidersHorizontal: LucideIcon;
  export const Star: LucideIcon;
  export const Target: LucideIcon;
  export const Trophy: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const Trash2: LucideIcon;
  export const Undo: LucideIcon;
  export const UsersRound: LucideIcon;
  export const LogOut: LucideIcon;
  export const X: LucideIcon;
}
