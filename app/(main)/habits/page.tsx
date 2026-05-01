"use client";
import { FeedWrapper } from "@/components/layout/feed-wrapper";
import { StickyWrapper } from "@/components/layout/sticky-wrapper";

import { HabitsClient } from "./habits-client";

import { StickyWrapperClient } from "@/components/layout/sticky-wrapper-client";
import { MobileHabitDrawer } from "@/components/mobile-habit-drawer";

import { useIsMobile } from "@/hooks/use-is-mobile"; // your hook

export default function HabitsPage() {
  const isMobile = useIsMobile();
  console.log("🚨 PAGE RENDER", new Date().toISOString());

  return (
    <div className="flex flex-row gap-x-[20px] px-6 ">
      <FeedWrapper>
        <HabitsClient />
      </FeedWrapper>

      {/* ✅ ONLY render on desktop */}
      {!isMobile && (
        <StickyWrapper>
          <StickyWrapperClient />
        </StickyWrapper>
      )}

      {/* ✅ ONLY render drawer on mobile */}
      {isMobile && <MobileHabitDrawer />}
    </div>
  );
}