import { FeedWrapper } from "@/components/layout/feed-wrapper";
import { StatsClient } from "./stats-client";
import { StickyWrapperClient } from "@/components/layout/sticky-wrapper-client";
import { DetailPanelWrapper } from "@/components/layout/detail-panel-wrapper";

const AnalyticsPage = () => {

  return (
    <div>
      <FeedWrapper>
        <StatsClient />
      </FeedWrapper>
      <DetailPanelWrapper>
        <StickyWrapperClient />
      </DetailPanelWrapper>
    </div>
  );
};

export default AnalyticsPage;
