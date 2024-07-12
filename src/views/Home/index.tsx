import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, withRouter } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { Grid, GridContainer, SummaryBox } from '@trussworks/react-uswds';
import classnames from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import NDABanner from 'components/NDABanner';
import PageHeading from 'components/PageHeading';
import Divider from 'components/shared/Divider';
import JOB_CODES from 'constants/jobCodes';
import useMessage from 'hooks/useMessage';
import { AppState } from 'reducers/rootReducer';
import { isAssessment, isMAC } from 'utils/user';
import Landing from 'views/Landing';
import ModelPlansTable from 'views/ModelPlan/Table';

import './index.scss';

const Home = () => {
  const { t } = useTranslation('home');
  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const isUserSet = useSelector((state: AppState) => state.auth.isUserSet);
  const flags = useFlags();

  const [tableHidden, hideTable] = useState<boolean>(false);

  const { message } = useMessage();

  const { authState } = useOktaAuth();
  const { pathname } = useLocation();
  const isLanding: boolean = pathname === '/' && !authState?.isAuthenticated;

  const headingType = (groups: typeof JOB_CODES) => {
    if (isAssessment(groups, flags)) {
      return t('requestsTable.admin.heading');
    }
    if (isMAC(userGroups)) {
      return t('requestsTable.mac.heading');
    }
    return t('requestsTable.basic.heading');
  };

  const renderView = () => {
    if (isUserSet) {
      return (
        <>
          <NDABanner collapsable />
          <GridContainer>
            {message}

            <Grid>
              <PageHeading className="margin-bottom-1">
                {t('title')}
              </PageHeading>

              <p className="line-height-body-5 font-body-lg text-light margin-top-0 margin-bottom-3">
                {!isMAC(userGroups) ? t('subheading') : t('macSubheading')}
              </p>

              {!isMAC(userGroups) && (
                <SummaryBox className="bg-base-lightest border-0 radius-0 padding-2 padding-bottom-3">
                  <p className="margin-0 margin-bottom-1">
                    {t('newModelSummaryBox.copy')}
                  </p>

                  <UswdsReactLink
                    className={classnames('usa-button', {
                      'usa-button--outline': isAssessment(userGroups, flags)
                    })}
                    variant="unstyled"
                    to="/models/steps-overview"
                  >
                    {t('newModelSummaryBox.cta')}
                  </UswdsReactLink>
                </SummaryBox>
              )}

              {!isMAC(userGroups) && !tableHidden && (
                <>
                  <Divider className="margin-top-6" />
                  <div className="mint-header__basic">
                    <h2 className="margin-top-4 margin-bottom-1">
                      {t('requestsTable.basic.heading')}
                    </h2>
                  </div>
                  <p className="margin-top-0 margin-bottom-2">
                    {t('yourModels')}
                  </p>
                </>
              )}

              {!isMAC(userGroups) && (
                <ModelPlansTable
                  type="home"
                  userModels
                  isAssessment={isAssessment(userGroups, flags)}
                  isMAC={isMAC(userGroups)}
                  hideTable={hideTable}
                  tableHidden={tableHidden}
                />
              )}

              {(isAssessment(userGroups, flags) || isMAC(userGroups)) && (
                <>
                  <Divider className="margin-top-6" />

                  <div className="mint-header__basic">
                    <h2 className="margin-top-4">{headingType(userGroups)}</h2>
                  </div>

                  <ModelPlansTable
                    type={isAssessment(userGroups, flags) ? 'home' : 'mac'}
                    userModels={false}
                    isAssessment={isAssessment(userGroups, flags)}
                    isMAC={isMAC(userGroups)}
                    csvDownload={isAssessment(userGroups, flags)}
                  />
                </>
              )}

              <SummaryBox className="bg-base-lightest border-0 radius-0 padding-2 padding-bottom-3 margin-top-6">
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
    return <>{isLanding ? <Landing /> : <NDABanner />}</>;
  };

  return <MainContent>{renderView()}</MainContent>;
};

export default withRouter(Home);
