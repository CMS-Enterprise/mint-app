import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Grid, GridContainer, SummaryBox } from '@trussworks/react-uswds';
import classnames from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import NDABanner from 'components/NDABanner';
import PageHeading from 'components/PageHeading';
import Expire from 'components/shared/Expire';
import useMessage from 'hooks/useMessage';
import { AppState } from 'reducers/rootReducer';
import user from 'utils/user';
import DraftModelPlansTable from 'views/ModelPlan/Table';

import WelcomeText from './WelcomeText';

import './index.scss';

const Home = () => {
  const { t } = useTranslation('home');
  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const isUserSet = useSelector((state: AppState) => state.auth.isUserSet);
  const flags = useFlags();

  const { message } = useMessage();

  const renderView = () => {
    if (isUserSet) {
      return (
        <>
          <NDABanner collapsable />
          <GridContainer>
            {message}

            <Grid>
              <PageHeading>{t('title')}</PageHeading>
              <p className="line-height-body-5 font-body-lg text-light margin-bottom-6">
                {t('subheading')}
              </p>
              <SummaryBox
                heading=""
                className="bg-base-lightest border-0 radius-0 padding-2 padding-bottom-3"
              >
                <p className="margin-0 margin-bottom-1">
                  {t('newModelSummaryBox.copy')}
                </p>
                <UswdsReactLink
                  className={classnames('usa-button', {
                    'usa-button--outline': user.isAssessment(userGroups, flags)
                  })}
                  variant="unstyled"
                  to="/models/steps-overview"
                >
                  {t('newModelSummaryBox.cta')}
                </UswdsReactLink>
              </SummaryBox>
              <hr className="home__hr margin-top-4" aria-hidden />
              <div className="mint-header__basic">
                <h2 className="margin-top-4">
                  {user.isAssessment(userGroups, flags)
                    ? t('requestsTable.admin.heading')
                    : t('requestsTable.basic.heading')}
                </h2>
              </div>
              <DraftModelPlansTable
                isAssessment={user.isAssessment(userGroups, flags)}
              />
              <SummaryBox
                heading=""
                className="bg-base-lightest border-0 radius-0 padding-2 padding-bottom-3 margin-top-6"
              >
                <p className="margin-0 margin-bottom-1">
                  {t('allModels.copy')}
                </p>
                <UswdsReactLink
                  className="usa-button usa-button--outline"
                  variant="unstyled"
                  to="/models"
                >
                  {t('allModels.cta')}
                </UswdsReactLink>
              </SummaryBox>
            </Grid>
          </GridContainer>
        </>
      );
    }
    return (
      <>
        <NDABanner />
        <GridContainer>
          <WelcomeText />
        </GridContainer>
      </>
    );
  };

  return <MainContent>{renderView()}</MainContent>;
};

export default withRouter(Home);
