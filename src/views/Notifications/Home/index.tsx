import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactPaginate from 'react-paginate';
import { Alert, Button, Grid, GridContainer } from '@trussworks/react-uswds';
import {
  Activity,
  useGetNotificationsQuery,
  useUpdateAllNotificationsAsReadMutation
} from 'gql/gen/graphql';

import Breadcrumbs from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import Expire from 'components/shared/Expire';
import Spinner from 'components/Spinner';
import useMessage from 'hooks/useMessage';
import { NotFoundPartial } from 'views/NotFound';

import IndividualNotification from './_components/IndividualNotification';

const NotificationsHome = () => {
  const [pageOffset, setPageOffset] = useState(0);

  const { t: notificationsT } = useTranslation('notifications');
  const { t: generalT } = useTranslation('general');
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const { message } = useMessage();

  const { data, loading, error, refetch } = useGetNotificationsQuery();
  const [markAllAsRead] = useUpdateAllNotificationsAsReadMutation();

  const numUnreadNotifications =
    data?.currentUser.notifications.numUnreadNotifications;

  const allNotifications = data?.currentUser.notifications.notifications || [];

  const breadcrumbs = [
    { text: miscellaneousT('home'), url: '/' },
    { text: notificationsT('breadcrumb') }
  ];

  if ((!loading && error) || (!loading && !data?.currentUser)) {
    return <NotFoundPartial />;
  }

  // Pagination Configuration
  const itemsPerPage = 10;
  const endOffset = pageOffset + itemsPerPage;
  const currentNotifications = allNotifications?.slice(pageOffset, endOffset);
  const pageCount = allNotifications
    ? Math.ceil(allNotifications.length / itemsPerPage)
    : 1;

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    const newOffset =
      (event.selected * itemsPerPage) % allNotifications?.length;
    setPageOffset(newOffset);
  };

  return (
    <MainContent data-testid="notification-index">
      <GridContainer>
        <Grid desktop={{ col: 12 }} tablet={{ col: 12 }} mobile={{ col: 12 }}>
          <Breadcrumbs className="margin-bottom-4" items={breadcrumbs} />

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
              currentNotifications?.map(notification => (
                <IndividualNotification
                  {...notification}
                  activity={notification.activity as Activity}
                  key={notification.id}
                />
              ))}
          </div>

          {pageCount > 1 && (
            <ReactPaginate
              data-testid="notification-pagination"
              breakLabel="..."
              breakClassName="usa-pagination__item usa-pagination__overflow"
              nextLabel="Next >"
              containerClassName="mint-pagination usa-pagination usa-pagination__list"
              previousLinkClassName={
                pageOffset === 0
                  ? 'display-none'
                  : 'usa-pagination__link usa-pagination__previous-page prev-page'
              }
              nextLinkClassName={
                pageOffset / itemsPerPage === pageCount - 1
                  ? 'display-none'
                  : 'usa-pagination__link usa-pagination__previous-page next-page'
              }
              disabledClassName="pagination__link--disabled"
              activeClassName="usa-current"
              activeLinkClassName="usa-current"
              pageClassName="usa-pagination__item"
              pageLinkClassName="usa-pagination__button"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="< Previous"
            />
          )}
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default NotificationsHome;
