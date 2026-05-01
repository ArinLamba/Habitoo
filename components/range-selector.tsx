"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRangeStore } from "@/store/use-range-store";

const options = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
  { label: "Last 180 days", value: "180" },
  { label: "Last 365 days", value: "365" },
  { label: "All time", value: "all" },
];

export const RangeSelect = () => {
  const { range, setRange } = useRangeStore();

  return (
    <Select
      value={String(range)}
      onValueChange={(val) =>
        setRange(val === "all" ? "all" : Number(val))
      }
    >
      <SelectTrigger className="w-[140px] border-0 shadow-2xl bg-white dark:bg-zinc-700/50">
        <SelectValue  />
      </SelectTrigger>

      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};