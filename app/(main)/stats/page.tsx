
import { StickyWrapper } from "@/components/layout/sticky-wrapper";

import { FeedWrapper } from "@/components/layout/feed-wrapper";
import { StatsClient } from "./stats-client";
import { StickyWrapperClient } from "@/components/layout/sticky-wrapper-client";

const StatsPage = () => {

  return (
    <div className="flex  gap-[20px] px-6 ">
      <FeedWrapper>
        <StatsClient />
      </FeedWrapper>
      <StickyWrapper>
        <StickyWrapperClient />
      </StickyWrapper>
    </div>
  );
};

export default StatsPage;