
import { StickyWrapper } from "@/components/layout/sticky-wrapper";

import { FeedWrapper } from "@/components/layout/feed-wrapper";
import { StatsClient } from "./stats-client";
import { StickyWrapperClient } from "@/components/layout/sticky-wrapper-client";

const AnalyticsPage = () => {

  return (
    <div>
      <FeedWrapper>
        <StatsClient />
      </FeedWrapper>
      <StickyWrapper>
        <StickyWrapperClient />
      </StickyWrapper>
    </div>
  );
};

export default AnalyticsPage;