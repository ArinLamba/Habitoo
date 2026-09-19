import { FeedWrapper } from "@/components/layout/feed-wrapper";
import { StatsClient } from "./stats-client";
import { DetailPanelWrapper } from "@/components/layout/detail-panel-wrapper";
import { AnalyticsRail } from "./analytics-rail";

const AnalyticsPage = () => {

  return (
    <div>
      <FeedWrapper>
        <StatsClient />
      </FeedWrapper>
      <DetailPanelWrapper>
        <AnalyticsRail />
      </DetailPanelWrapper>
    </div>
  );
};

export default AnalyticsPage;
