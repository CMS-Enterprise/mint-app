import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Grid,
  Link,
  Link as UswdsLink,
  ProcessList,
  ProcessListHeading,
  ProcessListItem,
  SummaryBox
} from '@trussworks/react-uswds';
import HelpBreadcrumb from 'features/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';
import RelatedArticles from 'features/HelpAndKnowledge/Articles/_components/RelatedArticles';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { tArray } from 'utils/translation';

import HelpCategoryTag from '../_components/HelpCategoryTag';
import LatestContentUpdate from '../_components/LatestContentUpdate';
import { ArticleCategories, HelpArticle } from '..';

type ModelPlanOverviewContentProps = {
  help?: boolean;
};

export const ModelPlanOverviewContent = ({
  help
}: ModelPlanOverviewContentProps) => {
  const { t } = useTranslation('modelPlanOverview');
  const summaryBoxListItems = tArray<string>(
    'modelPlanOverview:summaryBox.listItem'
  );

  return (
    <>
      <SummaryBox className="bg-base-lightest border-0 radius-0 padding-y-2 padding-x-2">
        <p className="margin-top-0 margin-bottom-1">
          {help ? t('summaryBox.copyHelp') : t('summaryBox.copy')}
        </p>

        <ul className="padding-left-3 margin-y-0">
          {summaryBoxListItems.map((item, index) => (
            <li key={item}>{t(`summaryBox.listItem.${index}`)}</li>
          ))}
        </ul>

        <p className="margin-y-1">
          <Trans i18nKey="modelPlanOverview:summaryBox.email">
            indexZero
            <UswdsLink href="mailto:MINTTeam@cms.hhs.gov">email</UswdsLink>
            indexTwo
          </Trans>
        </p>
      </SummaryBox>
      <PageHeading className="margin-top-7 margin-bottom-1" headingLevel="h2">
        {t('steps.heading')}
      </PageHeading>

      <p className="font-body-lg margin-y-0">{t('steps.description')}</p>

      <Grid desktop={{ col: 9 }} className="margin-top-105">
        <ProcessList>
          <ProcessListItem className="maxw-none">
            <ProcessListHeading type="h3">
              {t('steps.first.heading')}
            </ProcessListHeading>
            <p>{t('steps.first.description')}</p>
          </ProcessListItem>

          <ProcessListItem className="maxw-none">
            <ProcessListHeading type="h3">
              {t('steps.second.heading')}
            </ProcessListHeading>
            <p>{t('steps.second.description')}</p>
          </ProcessListItem>

          <ProcessListItem className="maxw-none padding-bottom-3">
            <ProcessListHeading type="h3">
              {t('steps.third.heading')}
            </ProcessListHeading>
            <p>{t('steps.third.description')}</p>
          </ProcessListItem>

          <ProcessListItem className="maxw-none">
            <ProcessListHeading type="h3">
              {t('steps.fourth.heading')}
            </ProcessListHeading>
            <p>{t('steps.fourth.description')}</p>
          </ProcessListItem>

          <ProcessListItem className="maxw-none">
            <ProcessListHeading type="h3">
              {t('steps.fifth.heading')}
            </ProcessListHeading>
            <p>
              <Trans
                i18nKey="modelPlanOverview:steps:fifth.description"
                components={{
                  link1: <Link href="mailto:MINTTeam@cms.hhs.gov"> </Link>
                }}
              />
            </p>
          </ProcessListItem>

          <ProcessListItem className="maxw-none">
            <ProcessListHeading type="h3">
              {t('steps.sixth.heading')}
            </ProcessListHeading>
            <p>{t('steps.sixth.description')}</p>
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

            <PageHeading className="margin-bottom-1">
              {t('overviewHeading')}
            </PageHeading>

            <HelpCategoryTag
              type={ArticleCategories.GETTING_STARTED}
              className="margin-bottom-4"
            />

            <ModelPlanOverviewContent help />

            <LatestContentUpdate file="modelPlanOverview.ts" />
          </div>
        </div>
      </MainContent>

      <RelatedArticles
        currentArticle={HelpArticle.MODEL_PLAN_OVERVIEW}
        specificArticles={[
          HelpArticle.TWO_PAGER_MEETING,
          HelpArticle.HIGH_LEVEL_PROJECT_PLAN,
          HelpArticle.SAMPLE_MODEL_PLAN
        ]}
        viewAllLink
      />
    </>
  );
};

export default ModelPlanOverview;
