import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Grid,
  GridContainer,
  ProcessList,
  ProcessListHeading,
  ProcessListItem,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';
import HelpBreadcrumb from 'features/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';
import RelatedArticles from 'features/HelpAndKnowledge/Articles/_components/RelatedArticles';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { tArray } from 'utils/translation';

import HelpCategoryTag from '../_components/HelpCategoryTag';
import { ArticleCategories, HelpArticle } from '..';

type ListItem = {
  heading: string;
  description: string;
};

export const UtilizingSolutions = () => {
  const { t } = useTranslation('utilizingSolutions');

  const summaryBoxConfig = tArray<string>(
    'utilizingSolutions:summaryBox.items'
  );

  const timingConfig = tArray<ListItem>('utilizingSolutions:timingSteps.items');

  const activityConfig = tArray<ListItem>(
    'utilizingSolutions:activitySteps.items'
  );

  return (
    <>
      <MainContent>
        <GridContainer>
          <Grid desktop={{ col: 12 }}>
            <HelpBreadcrumb text={t('title')} />

            <PageHeading className="margin-bottom-1 margin-top-4">
              {t('title')}
            </PageHeading>

            <HelpCategoryTag
              type={ArticleCategories.IT_IMPLEMENTATION}
              className="margin-bottom-1"
            />

            <p className="font-body-lg line-height-sans-5 margin-top-0 margin-bottom-4">
              {t('description')}
            </p>

            <SummaryBox className="bg-base-lightest border-0 radius-0 padding-y-2 padding-x-2">
              <p className="margin-top-0 margin-bottom-1">
                {t('summaryBox.copy')}
              </p>

              <ol className="padding-left-3 margin-y-0">
                {summaryBoxConfig.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </SummaryBox>

            <h2 className="margin-top-6 margin-bottom-2">
              {t('timingSteps.heading')}
            </h2>

            <p className="margin-y-0 line-height-sans-5">
              {t('timingSteps.description')}
            </p>

            <h3 className="margin-top-3 margin-bottom-5">
              {t('timingSteps.subHeading')}
            </h3>

            <ProcessList>
              {timingConfig.map((item, index) => (
                <ProcessListItem
                  className="read-only-model-plan__timeline__list-item margin-top-neg-4 maxw-full margin-bottom-4 padding-left-2"
                  key={item.description}
                >
                  <ProcessListHeading
                    type="h5"
                    className="font-body-sm text-normal"
                  >
                    <Trans
                      i18nKey={`utilizingSolutions:timingSteps.items.${index}.heading`}
                      components={{
                        bold: <strong />
                      }}
                    />
                  </ProcessListHeading>
                  <p className="margin-top-105">{item.description}</p>
                </ProcessListItem>
              ))}
            </ProcessList>

            <SummaryBox className="margin-bottom-6 margin-top-neg-4">
              <SummaryBoxHeading headingLevel="h3">
                {t('helpBox.heading')}
              </SummaryBoxHeading>
              <SummaryBoxContent>
                <Trans
                  i18nKey="utilizingSolutions:helpBox.description"
                  components={{
                    link1: (
                      // @ts-ignore
                      <UswdsReactLink
                        to="/help-and-knowledge/operational-solutions?page=1"
                        className="margin-top-2 display-inline-block"
                      />
                    )
                  }}
                />
              </SummaryBoxContent>
            </SummaryBox>

            <h2 className="margin-top-6 margin-bottom-2">
              {t('activitySteps.heading')}
            </h2>

            <p className="margin-y-0 line-height-sans-5">
              {t('activitySteps.description')}
            </p>

            <h3 className="margin-top-3 margin-bottom-6">
              {t('activitySteps.subHeading')}
            </h3>

            <ProcessList>
              {activityConfig.map((item, index) => (
                <ProcessListItem
                  className="read-only-model-plan__timeline__list-item margin-top-neg-4 maxw-full margin-bottom-4 padding-left-2"
                  key={item.heading}
                >
                  <ProcessListHeading type="h5" className="font-body-sm">
                    {item.heading}
                    <p className="text-normal margin-bottom-0 margin-top-105">
                      <Trans
                        i18nKey={`utilizingSolutions:activitySteps.items.${index}.description`}
                        components={{
                          bold: <strong />
                        }}
                      />
                    </p>
                  </ProcessListHeading>
                </ProcessListItem>
              ))}
            </ProcessList>

            <SummaryBox className="margin-bottom-6 margin-top-neg-4">
              <SummaryBoxHeading headingLevel="h3">
                {t('helpBox2.heading')}
              </SummaryBoxHeading>
              <SummaryBoxContent>
                <p className="margin-bottom-0">{t('helpBox2.description')}</p>
              </SummaryBoxContent>
            </SummaryBox>
          </Grid>
        </GridContainer>
      </MainContent>

      <RelatedArticles
        currentArticle={HelpArticle.UTILIZING_SOLUTIONS}
        specificArticles={[
          HelpArticle.PHASES_INVOLVED,
          HelpArticle.MODEL_SOLUTION_DESIGN,
          HelpArticle.MODEL_SOLUTION_IMPLEMENTATION
        ]}
        type={ArticleCategories.IT_IMPLEMENTATION}
        viewAllLink
      />
    </>
  );
};

export default UtilizingSolutions;
