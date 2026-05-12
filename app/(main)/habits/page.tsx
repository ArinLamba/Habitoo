
import { FeedWrapper } from "@/components/layout/feed-wrapper";
import { StickyWrapper } from "@/components/layout/sticky-wrapper";

import { HabitsClient } from "./habits-client";

import { StickyWrapperClient } from "@/components/layout/sticky-wrapper-client";


export default function HabitsPage() {

  console.log("🚨 PAGE RENDER", new Date().toISOString());

  return (
    <div className="flex flex-row gap-x-4">
      <FeedWrapper>
        <HabitsClient />
      </FeedWrapper>

      {/* ✅ ONLY render on desktop */}
  
      <StickyWrapper>
        <StickyWrapperClient />
      </StickyWrapper>
     
    </div>
  );
}