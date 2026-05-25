"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  Flame,
  Loader,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const habits = [
  { name: "Drink Water", value: "10 / 8 glasses", color: "#06b6d4", done: true },
  { name: "Read", value: "14 / 20 pages", color: "#3b82f6", done: false },
  { name: "Deep Work", value: "2 / 2 hours", color: "#6366f1", done: true },
  { name: "Evening Walk", value: "1.8 / 3 km", color: "#22c55e", done: false },
];

const heatmap = [
  0, 35, 100, 65, 0, 100, 75, 45, 100, 100, 30, 0, 70, 100, 55, 35, 100, 80,
  0, 40, 100, 65, 90, 0, 50, 100, 100, 70, 20, 95, 60, 0, 85, 100, 45,
];

const features = [
  {
    icon: Target,
    title: "Track real progress",
    text: "Log glasses, pages, hours, sessions, or any custom unit without forcing every habit into a checkbox.",
  },
  {
    icon: CalendarDays,
    title: "Daily to yearly rhythms",
    text: "Build daily rituals, weekly goals, monthly reviews, and yearly commitments in one calm timeline.",
  },
  {
    icon: BarChart3,
    title: "Momentum you can read",
    text: "See streaks, consistency, log history, and completion patterns without digging through clutter.",
  },
];

export default function Home() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader className="h-5 w-5 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-950 text-white">
      <section className="relative min-h-[calc(100vh-80px)] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#09090b_0%,#0f172a_48%,#09090b_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,11,0.98)_0%,rgba(9,9,11,0.84)_42%,rgba(9,9,11,0.28)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent" />

        <div className="relative mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-6xl grid-rows-[1fr_auto] px-5 pt-12">
          <div className="pointer-events-none absolute inset-y-8 right-[-110px] hidden w-[64%] items-center lg:flex">
            <ProductPreview />
          </div>

          <div className="flex items-center">
            <div className="max-w-xl py-8 lg:py-16">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-200">
                <Sparkles className="size-3.5" />
                Built for measurable habits and quiet consistency
              </div>

              <h1 className="text-6xl font-black tracking-normal text-white sm:text-7xl lg:text-8xl">
                Habitoo
              </h1>
              <p className="mt-5 max-w-lg text-lg font-semibold leading-8 text-zinc-300">
                A habit tracker for people who want more than checkmarks:
                streaks, real units, daily notes, and progress that feels alive.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {isSignedIn ? (
                  <Button asChild className="h-12 bg-blue-500 px-6 text-white hover:bg-blue-400">
                    <Link href="/habits">
                      Open Habitoo <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <SignUpButton mode="modal">
                      <Button className="h-12 bg-blue-500 px-6 text-white hover:bg-blue-400">
                        Start tracking <ArrowRight className="size-4" />
                      </Button>
                    </SignUpButton>
                    <SignInButton mode="modal">
                      <Button
                        className="h-12 border-zinc-700 bg-zinc-900/80 px-6 text-white hover:bg-zinc-800"
                        variant="outline"
                      >
                        I already have an account
                      </Button>
                    </SignInButton>
                  </>
                )}
              </div>

              <div className="mt-8 grid max-w-md grid-cols-3 gap-3 text-sm">
                <Metric label="Current streak" value="12d" />
                <Metric label="Month logs" value="86" />
                <Metric label="Consistency" value="78%" />
              </div>

              <div className="mt-8 lg:hidden">
                <ProductPreview />
              </div>
            </div>
          </div>

          <div className="grid gap-3 pb-5 sm:grid-cols-3">
            {features.map((feature) => (
              <div
                className="rounded-lg border border-white/10 bg-zinc-950/70 p-4 backdrop-blur"
                key={feature.title}
              >
                <feature.icon className="mb-3 size-5 text-blue-300" />
                <h2 className="text-sm font-extrabold text-white">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-white/10 bg-zinc-950 px-5 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-extrabold uppercase text-blue-300">
              Why it feels different
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">
              Designed around the way habits actually happen.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Detail
              icon={Activity}
              title="More than done"
              text="Add extra logs after a habit is complete and Habitoo keeps the real total visible."
            />
            <Detail
              icon={Flame}
              title="Streaks without pressure"
              text="Skipped and failed days stay explicit, while streaks keep daily, weekly, monthly, and yearly goals readable."
            />
            <Detail
              icon={ShieldCheck}
              title="Synced safely"
              text="Your account keeps habits, logs, and notes available across web and mobile."
            />
            <Detail
              icon={CalendarDays}
              title="Calendar-first detail"
              text="Open any habit and see the period, logged days, progress chart, and log history in one view."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
      <p className="text-xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs font-semibold text-zinc-500">{label}</p>
    </div>
  );
}

function Detail({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Target;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-5">
      <Icon className="size-5 text-blue-300" />
      <h3 className="mt-4 text-base font-extrabold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[680px] py-8">
      <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950 shadow-2xl shadow-blue-950/30">
        <div className="flex items-center justify-between border-b border-white/10 bg-zinc-900 px-4 py-3">
          <div className="flex items-center gap-3">
            <Image
              alt="Habitoo logo"
              className="rounded-md"
              height={34}
              src="/logo.png"
              width={34}
            />
            <div>
              <p className="text-sm font-black text-white">My Journal</p>
              <p className="text-xs font-semibold text-zinc-500">Today, 25 May</p>
            </div>
          </div>
          <div className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-200">
            4 active
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1fr_0.72fr]">
          <div className="border-white/10 lg:border-r">
            {habits.map((habit) => (
              <div
                className="flex items-center gap-3 border-b border-white/10 px-4 py-4 last:border-b-0"
                key={habit.name}
              >
                <div
                  className="flex size-11 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${habit.color}22` }}
                >
                  {habit.done ? (
                    <Check className="size-5 text-white" />
                  ) : (
                    <span
                      className="block size-3 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-white">
                    {habit.name}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-zinc-500">
                    {habit.value}
                  </p>
                </div>
                <div
                  className="h-8 w-16 rounded-full border"
                  style={{ borderColor: `${habit.color}66` }}
                />
              </div>
            ))}
          </div>

          <div className="p-4">
            <div className="rounded-lg border border-white/10 bg-zinc-900/80 p-4">
              <p className="text-xs font-extrabold uppercase text-zinc-500">
                Habit rhythm
              </p>
              <div className="mt-4 grid grid-cols-7 gap-1">
                {heatmap.map((value, index) => (
                  <div
                    className="aspect-square rounded-[3px] border border-white/5"
                    key={`${value}-${index}`}
                    style={{
                      backgroundColor:
                        value === 0
                          ? "#27272a"
                          : `rgba(59,130,246,${0.2 + value / 140})`,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/10 bg-zinc-900/80 p-4">
                <p className="text-2xl font-black text-white">12</p>
                <p className="text-xs font-semibold text-zinc-500">day streak</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-zinc-900/80 p-4">
                <p className="text-2xl font-black text-white">3.6k</p>
                <p className="text-xs font-semibold text-zinc-500">steps logged</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
