import { memo, useEffect } from "react";
import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import type { HabitIconName } from "../../../lib/habits-icon";
import { ICON_MAP } from "../../../lib/habits-icon";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 42;
const STROKE = 3;
const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type HabitProgressIconProps = {
  color?: string | null;
  percentage: number;
  currentStreak: number;
  icon: string | null | undefined;
};

function HabitProgressIconComponent({
  color,
  percentage,
  currentStreak,
  icon,
}: HabitProgressIconProps) {
  const safeColor = color ?? "#22c55e";
  const IconComponent =
    ICON_MAP[(icon as HabitIconName) || "QuestionMark"] || ICON_MAP.QuestionMark;

  const animatedPercentage = useSharedValue(percentage);

  useEffect(() => {
    animatedPercentage.value = withTiming(Math.min(100, Math.max(0, percentage)), {
      duration: 700,
    });
  }, [animatedPercentage, percentage]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset:
      CIRCUMFERENCE - (CIRCUMFERENCE * animatedPercentage.value) / 100,
  }));

  return (
    <View className="items-center">
      <View className="relative h-12 w-12">
        <Svg
          width={SIZE}
          height={SIZE}
          style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}
        >
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={STROKE}
            fill="none"
          />
          <AnimatedCircle
            animatedProps={animatedProps}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={safeColor}
            strokeWidth={STROKE}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
          />
        </Svg>

        <View
          className="absolute inset-0 items-center justify-center"
          pointerEvents="none"
        >
          <View
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: `${safeColor}15` }}
          >
            <IconComponent color={safeColor} size={22} />
          </View>
        </View>
      </View>

      <Text
        className="mt-1 text-[11px] font-extrabold leading-none"
        style={{ color: safeColor }}
      >
        {currentStreak}
      </Text>
    </View>
  );
}

export const HabitProgressIcon = memo(HabitProgressIconComponent);
