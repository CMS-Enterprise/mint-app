import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Grid,
  Link as UswdsLink,
  ProcessList,
  ProcessListHeading,
  ProcessListItem,
  SummaryBox
} from '@trussworks/react-uswds';

import HelpBreadcrumb from 'components/HelpBreadcrumb';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import RelatedArticles from 'components/RelatedArticles';

type ModelPlanOverviewContentProps = {
  help?: boolean;
};

export const ModelPlanOverviewContent = ({
  help
}: ModelPlanOverviewContentProps) => {
  const { t } = useTranslation('modelPlanOverview');

  return (
    <>
      <SummaryBox
        heading=""
        className="bg-base-lightest border-0 radius-0 padding-y-2 padding-x-2"
      >
        <p className="margin-top-0 margin-bottom-1">
          {help ? t('summaryBox.copyHelp') : t('summaryBox.copy')}
        </p>
        <ul className="padding-left-3 margin-y-0">
          <li>{t('summaryBox.listItem.start')}</li>
          <li>{t('summaryBox.listItem.upload')}</li>
          <li>{t('summaryBox.listItem.track')}</li>
        </ul>
        <p className="margin-y-1">
          <Trans i18nKey="modelPlanOverview:summaryBox.email">
            indexZero
            <UswdsLink href="mailto:MINTTeam@cms.hhs.gov">email</UswdsLink>
            indexTwo
          </Trans>
        </p>
      </SummaryBox>
      <PageHeading className="margin-top-7 margin-bottom-1 font-body-xl">
        {t('steps.heading')}
      </PageHeading>
      <p className="font-body-lg margin-y-0">{t('steps.description')}</p>

      <Grid desktop={{ col: 6 }} className="margin-top-105">
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

          <ProcessListItem>
            <ProcessListHeading type="h3">
              {t('steps.fourth.heading')}
            </ProcessListHeading>
            <p>{t('steps.fourth.description')}</p>
          </ProcessListItem>

          <ProcessListItem>
            <ProcessListHeading type="h3">
              {t('steps.fifth.heading')}
            </ProcessListHeading>
            <p>{t('steps.fifth.description')}</p>
          </ProcessListItem>
        </ProcessList>
      </Grid>
    </>
  );
};

export const ModelPlanOverview = () => {
  const { t } = useTranslation('modelPlanOverview');

  return (
    <>
      <MainContent>
        <div className="grid-container">
          <div className="tablet:grid-col-12">
            <HelpBreadcrumb text={t('overviewHeading')} />
            <PageHeading>{t('overviewHeading')}</PageHeading>
            <ModelPlanOverviewContent help />
          </div>
        </div>
      </MainContent>
      <RelatedArticles currentArticle="Model Plan Overview" />
    </>
  );
};

export default ModelPlanOverview;
