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

import IndividualNotification from './_components/IndividualNotification';

const NotificationsHome = () => {
  const { t: notificationsT } = useTranslation('notifications');
  const { t: generalT } = useTranslation('general');
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const { data, loading, error, refetch } = useGetNotificationsQuery();
  const [markAllAsRead] = useUpdateAllMessagesAsReadMutation();

  const numUnreadNotifications =
    data?.currentUser.notifications.numUnreadNotifications;

  const allNotifications = data?.currentUser.notifications.notifications;
  // console.log(
  //   allNotifications?.sort((a, b) => {
  //     a.createdDts.localeCompare(b.createdDts);
  //   })
  // );

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
              {numUnreadNotifications !== 0 && (
                <Button
                  type="button"
                  unstyled
                  className="margin-y-0 margin-x-2"
                  onClick={() => markAllAsRead().then(() => refetch())}
                >
                  {notificationsT('index.markAllAsRead')}
                </Button>
              )}

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

          {allNotifications?.length === 0 && (
            <Alert type="info" slim headingLevel="h3">
              {notificationsT('index.infoBanner.emptyState')}
            </Alert>
          )}

          {allNotifications?.length !== 0 &&
            allNotifications?.map((notification, index) => (
              <IndividualNotification
                {...notification}
                key={notification.id}
                index={index}
              />
            ))}
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default NotificationsHome;
