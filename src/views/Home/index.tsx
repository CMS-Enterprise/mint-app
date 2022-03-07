import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Alert } from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';

import LinkCard from 'components/LinkCard';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import RequestRepository from 'components/RequestRepository';
import useMessage from 'hooks/useMessage';
import { AppState } from 'reducers/rootReducer';
import user from 'utils/user';
import List from 'views/Accessibility/AccessibilityRequest/List';
import Table from 'views/MyRequests/Table';

import WelcomeText from './WelcomeText';

import './index.scss';

const Home = () => {
  const { t } = useTranslation();
  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const isUserSet = useSelector((state: AppState) => state.auth.isUserSet);
  const flags = useFlags();

  const { message } = useMessage();

  const renderView = () => {
    if (isUserSet) {
      if (user.isGrtReviewer(userGroups, flags)) {
        return (
          // Changed GRT table from grid-container to just slight margins. This is take up
          // entire screen to better fit the more expansive data in the table.
          <div>
            {message && (
              <div className="grid-container margin-top-6">
                <Alert type="success" slim role="alert">
                  {message}
                </Alert>
              </div>
            )}
            <RequestRepository />
          </div>
        );
      }

      if (user.isAccessibilityTeam(userGroups, flags)) {
        return <List />;
      }

      if (user.isBasicUser(userGroups, flags)) {
        return (
          <div className="grid-container">
            {message && (
              <div className="grid-container margin-top-6">
                <Alert type="success" slim role="alert">
                  {message}
                </Alert>
              </div>
            )}
            <div className="tablet:grid-col-10">
              <PageHeading>{t('home:title')}</PageHeading>
              <p className="line-height-body-5 font-body-lg text-light margin-bottom-6">
                {t('home:subtitle')}
              </p>
              <div className="display-flex flex-row">
                <LinkCard
                  link="/system/making-a-request"
                  heading={t('home:actions.itg.heading')}
                  className="margin-right-2"
                >
                  {t('home:actions.itg.body')}
                </LinkCard>
                <LinkCard
                  link="/508/making-a-request"
                  heading={t('home:actions.508.heading')}
                >
                  {t('home:actions.508.body')}
                </LinkCard>
              </div>
              <hr className="home__hr margin-top-4" aria-hidden />
              <h2 className="margin-top-4">
                {t('home:requestsTable.heading')}
              </h2>
            </div>
            <div className="tablet:grid-col-12">
              <Table />
            </div>
          </div>
        );
      }
    }
    return (
      <div className="grid-container">
        <WelcomeText />
      </div>
    );
  };

  return <MainContent className="margin-bottom-5">{renderView()}</MainContent>;
};

export default withRouter(Home);
