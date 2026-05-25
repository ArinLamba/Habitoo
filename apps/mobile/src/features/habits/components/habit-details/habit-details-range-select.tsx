import { ChevronDown } from "lucide-react-native";
import { memo, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

export type HeatmapRange = "7" | "30" | "90" | "180" | "365" | "all";

const options: { label: string; value: HeatmapRange }[] = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
  { label: "Last 180 days", value: "180" },
  { label: "Last 365 days", value: "365" },
  { label: "All time", value: "all" },
];

type HabitDetailsRangeSelectProps = {
  value: HeatmapRange;
  onChange: (value: HeatmapRange) => void;
};

export const HabitDetailsRangeSelect = memo(function HabitDetailsRangeSelect({
  value,
  onChange,
}: HabitDetailsRangeSelectProps) {
  const [open, setOpen] = useState(false);
  const current = options.find((opt) => opt.value === value)?.label ?? "Last 90 days";

  return (
    <>
      <Pressable
        accessibilityRole="button"
        className="h-10 min-w-[132px] flex-row items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3"
        onPress={() => setOpen(true)}
      >
        <Text className="flex-1 text-xs font-extrabold text-zinc-300" numberOfLines={1}>
          {current}
        </Text>
        <ChevronDown color="#a1a1aa" size={15} strokeWidth={3} />
      </Pressable>

      <Modal animationType="fade" transparent visible={open} onRequestClose={() => setOpen(false)}>
        <Pressable
          className="flex-1 justify-end bg-black/60"
          onPress={() => setOpen(false)}
        >
          <Pressable
            className="rounded-t-3xl border-t border-zinc-800 bg-zinc-950 p-4"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="mb-3 text-center text-sm font-extrabold text-zinc-500">
              History range
            </Text>
            {options.map((opt) => (
              <Pressable
                accessibilityRole="button"
                className={`mb-1 rounded-xl px-4 py-3 ${
                  value === opt.value ? "bg-zinc-800" : ""
                }`}
                key={opt.value}
                onPress={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                <Text
                  className={`text-center font-bold ${
                    value === opt.value ? "text-white" : "text-zinc-400"
                  }`}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
});
