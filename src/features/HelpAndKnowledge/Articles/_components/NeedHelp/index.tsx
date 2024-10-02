import React from 'react';
import { Trans } from 'react-i18next';
import {
  Icon,
  Link,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';
import i18next from 'i18next';

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
            link1: <Link href="mailto:MINTTeam@cms.hhs.gov"> </Link>,
            mailIcon: <Icon.MailOutline className="margin-left-05 top-05" />
          }}
        />
      </SummaryBoxContent>
    </SummaryBox>
  );
};

export default NeedHelp;
