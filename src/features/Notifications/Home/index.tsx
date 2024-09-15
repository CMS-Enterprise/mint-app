import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Grid, GridContainer } from '@trussworks/react-uswds';
import {
  Activity,
  GetNotificationsQuery,
  useGetNotificationsQuery,
  useUpdateAllNotificationsAsReadMutation
} from 'gql/gen/graphql';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import Expire from 'components/Expire';
import Spinner from 'components/Spinner';
import useMessage from 'hooks/useMessage';
import usePagination from 'hooks/usePagination';
import { NotFoundPartial } from 'features/NotFound';

import IndividualNotification from './_components/IndividualNotification';

const NotificationsHome = () => {
  const { t: notificationsT } = useTranslation('notifications');
  const { t: generalT } = useTranslation('general');

  const { message } = useMessage();

  const { data, loading, error, refetch } = useGetNotificationsQuery();
  const [markAllAsRead] = useUpdateAllNotificationsAsReadMutation();

  const numUnreadNotifications =
    data?.currentUser.notifications.numUnreadNotifications;

  const allNotifications = useMemo(
    () => data?.currentUser.notifications.notifications || [],
    [data?.currentUser.notifications.notifications]
  );

  const { currentItems, Pagination } = usePagination<
    GetNotificationsQuery['currentUser']['notifications']['notifications']
  >({
    items: allNotifications,
    itemsPerPage: 10,
    loading
  });

  if ((!loading && error) || (!loading && !data?.currentUser)) {
    return <NotFoundPartial />;
  }

  return (
    <MainContent data-testid="notification-index">
      <GridContainer>
        <Grid desktop={{ col: 12 }} tablet={{ col: 12 }} mobile={{ col: 12 }}>
          <Breadcrumbs
            className="margin-bottom-4"
            items={[
              BreadcrumbItemOptions.HOME,
              BreadcrumbItemOptions.NOTIFICATIONS
            ]}
          />

          {message && <Expire delay={45000}>{message}</Expire>}

          <Grid
            row
            desktop={{ col: 12 }}
            className="flex-justify flex-align-center"
          >
            <Grid>
              <PageHeading className="margin-top-0 margin-right-2 margin-bottom-2">
                {notificationsT('index.heading')}
              </PageHeading>
            </Grid>

            <Grid className="margin-bottom-2">
              <Button
                type="button"
                disabled={numUnreadNotifications === 0}
                unstyled
                className={`width-auto margin-right-2 ${
                  numUnreadNotifications === 0 ? 'text-uswds-disabled' : ''
                }`}
                onClick={() => {
                  if (numUnreadNotifications !== 0) {
                    markAllAsRead().then(() => refetch());
                  }
                }}
              >
                {notificationsT('index.markAllAsRead', {
                  number: numUnreadNotifications
                })}
              </Button>

              <UswdsReactLink
                className={`margin-y-0 ${
                  numUnreadNotifications !== 0 ? 'margin-x-2' : ''
                }`}
                to="/notifications/settings"
              >
                {notificationsT('index.notificationSettings')}
              </UswdsReactLink>
            </Grid>
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

          <div className="margin-bottom-4">
            {allNotifications?.length !== 0 &&
              currentItems?.map(notification => (
                <IndividualNotification
                  {...notification}
                  activity={notification.activity as Activity}
                  key={notification.id}
                />
              ))}
          </div>

          {Pagination}
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default NotificationsHome;
