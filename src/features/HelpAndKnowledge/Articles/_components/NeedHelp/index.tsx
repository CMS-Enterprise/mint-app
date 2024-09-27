import React from 'react';
import { Trans } from 'react-i18next';
import {
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';
import i18next from 'i18next';

import ExternalLink from 'components/ExternalLink';

const NeedHelp = () => {
  return (
    <SummaryBox className="margin-y-6">
      <SummaryBoxHeading headingLevel="h3">
        {i18next.t('sixPageMeeting:footerSummaryBox.title')}
      </SummaryBoxHeading>

      <SummaryBoxContent>
        <Trans
          i18nKey="sixPageMeeting:footerSummaryBox.body"
          components={{
            link1: (
              <ExternalLink href="mailto:MINTTeam@cms.hhs.gov" mail>
                {' '}
              </ExternalLink>
            )
          }}
        />
      </SummaryBoxContent>
    </SummaryBox>
  );
};

export default NeedHelp;
