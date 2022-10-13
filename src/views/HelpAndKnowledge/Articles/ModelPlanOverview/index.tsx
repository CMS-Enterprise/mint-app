import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Link as UswdsLink,
  ProcessList,
  ProcessListHeading,
  ProcessListItem,
  SummaryBox
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

export const ModelPlanOverviewContent = () => {
  const { t } = useTranslation('modelPlanOverview');

  return (
    <div>
      <SummaryBox
        heading=""
        className="bg-base-lightest border-0 radius-0 padding-y-1 padding-x-2"
      >
        <p className="margin-top-0">{t('summaryBox.copy')}</p>
        <ul className="padding-left-3">
          <li>{t('summaryBox.listItem.add')}</li>
          <li>{t('summaryBox.listItem.upload')}</li>
        </ul>
        <p className="margin-bottom-1">
          <Trans i18nKey="modelPlanOverview:summaryBox.email">
            indexZero
            <UswdsLink href="mailto:CMS_Section508@cms.hhs.gov">
              email
            </UswdsLink>
            indexTwo
          </Trans>
        </p>
      </SummaryBox>
      <PageHeading className="margin-top-7 margin-bottom-1">
        {t('steps.heading')}
      </PageHeading>
      <p className="font-body-lg margin-y-0">{t('steps.description')}</p>

      <div className="tablet:grid-col-6 margin-top-105">
        <ProcessList>
          <ProcessListItem>
            <ProcessListHeading type="h3">
              {t('steps.first.heading')}
            </ProcessListHeading>
            <p>{t('steps.first.description')}</p>
          </ProcessListItem>
          <ProcessListItem>
            <ProcessListHeading type="h3">
              {t('steps.second.heading')}
            </ProcessListHeading>
            <p>{t('steps.second.description')}</p>
          </ProcessListItem>
          <ProcessListItem className="padding-bottom-3">
            <ProcessListHeading type="h3">
              {t('steps.third.heading')}
            </ProcessListHeading>
            <p>{t('steps.third.description')}</p>
          </ProcessListItem>
        </ProcessList>
        <hr className="margin-top-0 margin-bottom-05" />
        {/* @ts-ignore */}
        <ProcessList className="model-plan-step-list--counter-reset" start={4}>
          <ProcessListItem>
            <ProcessListHeading type="h3">
              {t('steps.fourth.heading')}
            </ProcessListHeading>
            <p>{t('steps.fourth.description')}</p>
          </ProcessListItem>
        </ProcessList>
        <UswdsReactLink
          className="usa-button margin-bottom-10"
          variant="unstyled"
          to="/models/new-plan"
          data-testid="continue-link"
        >
          {t('getStartedButton')}
        </UswdsReactLink>
      </div>
    </div>
  );
};

export const ModelPlanOverview = () => {
  const { t } = useTranslation('modelPlanOverview');

  return (
    <MainContent>
      <div className="grid-container">
        <div className="tablet:grid-col-12">
          <BreadcrumbBar variant="wrap">
            <Breadcrumb>
              <BreadcrumbLink asCustom={UswdsReactLink} to="/">
                <span>{useTranslation('header').t('home')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb current>{t('overviewHeading')}</Breadcrumb>
          </BreadcrumbBar>
          <PageHeading>{t('overviewHeading')}</PageHeading>
          <ModelPlanOverviewContent />
        </div>
      </div>
    </MainContent>
  );
};

export default ModelPlanOverview;
