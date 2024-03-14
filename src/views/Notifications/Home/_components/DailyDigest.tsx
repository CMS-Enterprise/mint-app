import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';

const DailyDigest = () => {
  const { t: notificationsT } = useTranslation('notifications');

  return (
    <Grid
      desktop={{ col: 12 }}
      className="border-1 border-base-lightest padding-x-3 padding-y-5"
      data-testid="notification--daily-digest"
    >
      <PageHeading headingLevel="h2" className="margin-top-0 margin-bottom-4">
        {notificationsT('index.dailyDigest.heading')}
      </PageHeading>

      <div className="border-top-1px border-base-light padding-top-2">
        <p className="margin-y-0">
          {notificationsT('index.dailyDigest.unsubscribe')}
        </p>
      </div>
    </Grid>
  );
};

export default DailyDigest;
