import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';

const DatesChanged = () => {
  const { t: notificationsT } = useTranslation('notifications');
  const { t: basicsMiscT } = useTranslation('basicsMisc');

  return (
    <Grid
      desktop={{ col: 12 }}
      className="border-1 border-base-lightest padding-x-3 padding-y-5"
      data-testid="notification--dates-changed"
    >
      <PageHeading headingLevel="h2" className="margin-top-0 margin-bottom-2">
        {notificationsT('index.datesChanged.heading')}
      </PageHeading>
      <p className="margin-top-0 margin-bottom-3">
        {notificationsT('index.datesChanged.subheading')}
      </p>
      <PageHeading headingLevel="h3" className="margin-top-0 margin-bottom-3">
        {basicsMiscT('highLevelTimeline')}
      </PageHeading>
    </Grid>
  );
};

export default DatesChanged;
