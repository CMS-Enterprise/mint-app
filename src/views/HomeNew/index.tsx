import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import {
  Card,
  Grid,
  GridContainer,
  Icon,
  SummaryBox
} from '@trussworks/react-uswds';
import classnames from 'classnames';
import {
  useGetHomepageSettingsQuery,
  ViewCustomizationType
} from 'gql/gen/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import NDABanner from 'components/NDABanner';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import Divider from 'components/shared/Divider';
import useMessage from 'hooks/useMessage';
import { AppState } from 'reducers/rootReducer';
import { isAssessment, isMAC } from 'utils/user';
import Landing from 'views/Landing';
import ModelPlansTable from 'views/ModelPlan/Table';

import './index.scss';

// TODO: Rename once old home is removed
const HomeNew = () => {
  const { t } = useTranslation('customHome');

  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const isUserSet = useSelector((state: AppState) => state.auth.isUserSet);

  const flags = useFlags();

  const { message } = useMessage();

  const { authState } = useOktaAuth();

  const { pathname } = useLocation();

  const isLanding: boolean = pathname === '/' && !authState?.isAuthenticated;

  const { data, loading } = useGetHomepageSettingsQuery();

  const homepageComponents: Record<ViewCustomizationType, JSX.Element> = {
    [ViewCustomizationType.MY_MODEL_PLANS]: (
      <>
        <Divider className="margin-y-6" />

        <h2 className="margin-top-0 margin-bottom-2">
          {t('requestsTable.basic.heading')}
        </h2>

        <p>{t('requestsTable.basic.subheading')}</p>

        <ModelPlansTable
          type="home"
          userModels
          isAssessment={isAssessment(userGroups, flags)}
          isMAC={false}
        />
      </>
    ),
    [ViewCustomizationType.ALL_MODEL_PLANS]: (
      <>
        <Divider className="margin-y-6" />

        <h2 className="margin-top-0">{t('requestsTable.admin.heading')}</h2>

        <ModelPlansTable
          type="home"
          userModels={false}
          isAssessment={isAssessment(userGroups, flags)}
          isMAC={false}
        />
      </>
    ),
    [ViewCustomizationType.FOLLOWED_MODELS]: <></>,
    [ViewCustomizationType.MODELS_WITH_CR_TDL]: <></>,
    [ViewCustomizationType.MODELS_BY_OPERATIONAL_SOLUTION]: <></>
  };

  const renderView = () => {
    if (isUserSet) {
      return (
        <>
          <NDABanner collapsable />
          <GridContainer>
            {message}

            <Grid data-testid="homepage">
              <Grid row>
                <Grid tablet={{ col: 8 }}>
                  <div>
                    <PageHeading className="margin-bottom-1">
                      {t('title')}
                    </PageHeading>

                    <p className="line-height-body-5 font-body-lg text-light margin-top-0 margin-bottom-3">
                      {!isMAC(userGroups)
                        ? t('subheading')
                        : t('macSubheading')}
                    </p>
                  </div>
                </Grid>

                <Grid tablet={{ col: 4 }}>
                  <Card className="margin-top-4 margin-bottom-0 home__card display-flex">
                    <p className="text-bold margin-top-0">
                      {t('customizeHomepage')}
                    </p>

                    <div>
                      <UswdsReactLink
                        variant="unstyled"
                        to="/homepage-settings"
                        className="display-flex flex-align-center"
                      >
                        <Icon.Edit className="margin-right-1 text-primary" />
                        {t('editHomepage')}
                      </UswdsReactLink>
                    </div>
                  </Card>
                </Grid>
              </Grid>

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

              {!loading &&
                data?.userViewCustomization.viewCustomization.length === 0 && (
                  <Alert type="info" heading={t('emptyHome')}>
                    <div className="display-flex flex-align-center">
                      <UswdsReactLink
                        variant="unstyled"
                        to="/homepage-settings"
                        className="margin-right-1"
                      >
                        {t('editHomepage')}
                      </UswdsReactLink>
                      <Icon.ArrowForward />
                    </div>
                  </Alert>
                )}

              {loading ? (
                <PageLoading />
              ) : (
                data?.userViewCustomization.viewCustomization.map(
                  customization => (
                    <div key={customization}>
                      {homepageComponents[customization]}
                    </div>
                  )
                )
              )}

              <SummaryBox className="bg-base-lightest border-0 radius-0 padding-2 padding-bottom-3 margin-top-6">
                <p className="margin-0 margin-bottom-1">
                  {t('allModels.copy')}
                </p>

                <UswdsReactLink variant="unstyled" to="/models">
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

export default HomeNew;
