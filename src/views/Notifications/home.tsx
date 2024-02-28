import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Grid, GridContainer } from '@trussworks/react-uswds';

import Breadcrumbs from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

const NotificationsHome = () => {
  const { t: notificationsT } = useTranslation('notifications');
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const breadcrumbs = [
    { text: miscellaneousT('home'), url: '/' },
    { text: notificationsT('breadcrumb') }
  ];

  return (
    <MainContent data-testid="notification-index">
      <GridContainer>
        <Grid desktop={{ col: 12 }} tablet={{ col: 12 }} mobile={{ col: 12 }}>
          <Breadcrumbs className="margin-bottom-4" items={breadcrumbs} />

          <Grid
            row
            desktop={{ col: 12 }}
            className="flex-justify flex-align-center"
          >
            <PageHeading className="margin-y-0">
              {notificationsT('index.heading')}
            </PageHeading>

            <div>
              <Button
                type="button"
                unstyled
                className="margin-y-0 margin-x-2"
                // onClick={() => console.log('marked as read')}
              >
                {notificationsT('index.markAllAsRead')}
              </Button>

              <UswdsReactLink
                className="margin-y-0 margin-x-2"
                to="/notifications/settings"
              >
                {notificationsT('index.notificationSettings')}
              </UswdsReactLink>
            </div>
          </Grid>

          <Alert type="info" slim headingLevel="h3">
            {notificationsT('index.infoBanner.emptyState')}
          </Alert>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default NotificationsHome;
