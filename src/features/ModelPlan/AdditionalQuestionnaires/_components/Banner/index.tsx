import React from 'react';
import { Icon, SummaryBox, SummaryBoxContent } from '@trussworks/react-uswds';

const QuestionnaireBanner = ({ bannerText }: { bannerText: string }) => {
  return (
    <SummaryBox className="padding-x-0 padding-y-1 border-0">
      <SummaryBoxContent>
        <div className="grid-container display-flex">
          <Icon.Info
            size={3}
            className="minw-3 margin-right-2"
            aria-label="info"
          />
          <p className="padding-y-0 margin-0">{bannerText}</p>
        </div>
      </SummaryBoxContent>
    </SummaryBox>
  );
};

export default QuestionnaireBanner;
