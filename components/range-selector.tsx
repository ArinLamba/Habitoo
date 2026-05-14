"use client";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const options = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
  { label: "Last 180 days", value: "180" },
  { label: "Last 365 days", value: "365" },
  { label: "All time", value: "all" },
];

export const RangeSelect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentRange = searchParams.get("range") || "90";

  return (
    <Select
      value={currentRange}
      onValueChange={(val) => {
        const params = new URLSearchParams(
          searchParams.toString()
        );

        params.set("range", val);

        router.replace(`?${params.toString()}`);
      }}
      
    >
      <SelectTrigger className="w-[140px] border-0  rounded-none dark:bg-zinc-900">
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