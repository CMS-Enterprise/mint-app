import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Grid, GridContainer } from '@trussworks/react-uswds';
import {
  useGetNotificationsQuery,
  useUpdateAllMessagesAsReadMutation
} from 'gql/gen/graphql';

import Breadcrumbs from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import Spinner from 'components/Spinner';
import { NotFoundPartial } from 'views/NotFound';

const NotificationsHome = () => {
  const { t: notificationsT } = useTranslation('notifications');
  const { t: generalT } = useTranslation('general');
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const { data, loading, error } = useGetNotificationsQuery();
  const [update] = useUpdateAllMessagesAsReadMutation();

  const breadcrumbs = [
    { text: miscellaneousT('home'), url: '/' },
    { text: notificationsT('breadcrumb') }
  ];

  if ((!loading && error) || (!loading && !data?.currentUser)) {
    return <NotFoundPartial />;
  }

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
                onClick={() => update()}
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

          {loading && (
            <Spinner
              size="large"
              center
              aria-valuetext={generalT('pageLoading')}
              aria-busy
            />
          )}

          <Alert type="info" slim headingLevel="h3">
            {notificationsT('index.infoBanner.emptyState')}
          </Alert>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default NotificationsHome;
