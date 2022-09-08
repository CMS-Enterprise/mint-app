import React from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import {
  Alert,
  Grid,
  GridContainer,
  IconStarOutline,
  SummaryBox
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

import Table from '../ReadOnly/Table';

const ModelPlan = () => {
  const { t } = useTranslation('readOnlyModelPlan');
  const { t: h } = useTranslation('home');

  return (
    <MainContent data-testid="model-plan-overview">
      <GridContainer>
        <Grid className="padding-bottom-6 margin-bottom-4 border-bottom border-base-light">
          <PageHeading className="margin-bottom-1">{t('heading')}</PageHeading>
          <p className="line-height-body-5 font-body-lg text-light margin-bottom-05 margin-top-0">
            {t('subheading')}
          </p>
          <UswdsReactLink variant="unstyled" to="/models#all-models">
            {t('allModelsLink')}
          </UswdsReactLink>
          <SummaryBox
            heading=""
            className="bg-base-lightest border-0 radius-0 padding-2 padding-bottom-3 margin-top-3 "
          >
            <p className="margin-0 margin-bottom-1">
              {h('newModelSummaryBox.copy')}
            </p>
            <UswdsReactLink
              className="usa-button usa-button--outline"
              variant="unstyled"
              to="/models/steps-overview"
            >
              {h('newModelSummaryBox.cta')}
            </UswdsReactLink>
          </SummaryBox>
        </Grid>

        <Grid className="padding-bottom-6 margin-bottom-4 border-bottom border-base-light">
          <PageHeading className="margin-bottom-1">
            {t('following.heading')}
          </PageHeading>
          <p className="line-height-body-5 text-light margin-bottom-05 margin-top-0">
            {t('following.subheading')}
          </p>
          <Alert type="info" heading={t('following.alert.heading')}>
            <p className="display-flex flex-align-center flex-wrap margin-0 ">
              {t('following.alert.subheadingPartA')}
              <span className="display-flex flex-align-center margin-x-05">
                (<IconStarOutline size={3} />)
              </span>

              {t('following.alert.subheadingPartB')}
            </p>
          </Alert>
        </Grid>
        <Grid>
          <PageHeading className="margin-bottom-1" id="all-models">
            {t('allModels.heading')}
          </PageHeading>
          <p className="line-height-body-5 text-light margin-bottom-3 margin-top-0">
            {t('allModels.subheading')}
          </p>
          <Table />
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default withRouter(ModelPlan);
