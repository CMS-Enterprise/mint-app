import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, GridContainer } from '@trussworks/react-uswds';
import HelpBreadcrumb from 'features/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';
import HelpCategoryTag from 'features/HelpAndKnowledge/Articles/_components/HelpCategoryTag';
import RelatedArticles from 'features/HelpAndKnowledge/Articles/_components/RelatedArticles';
import ReadOnly from 'features/ModelPlan/ReadOnly';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import SectionWrapper from 'components/SectionContainer';

import { ArticleCategories, HelpArticle } from '..';

export const SampleModelPlan = () => {
  const { t } = useTranslation('sampleModelPlan');

  return (
    <>
      <MainContent>
        <GridContainer>
          <Grid>
            <HelpBreadcrumb text={t('title')} />
            <PageHeading className="margin-bottom-1">{t('title')}</PageHeading>
            <HelpCategoryTag
              type={ArticleCategories.GETTING_STARTED}
              className="margin-bottom-1"
            />
            <p className="font-body-lg line-height-sans-5 margin-top-0 margin-bottom-6">
              {t('description')}
            </p>
          </Grid>
        </GridContainer>
      </MainContent>
      <ReadOnly isHelpArticle />
      <SectionWrapper className="margin-top-6">
        <RelatedArticles
          currentArticle={HelpArticle.SAMPLE_MODEL_PLAN}
          specificArticles={[
            HelpArticle.TWO_PAGER_MEETING,
            HelpArticle.HIGH_LEVEL_PROJECT_PLAN,
            HelpArticle.MODEL_PLAN_OVERVIEW
          ]}
          viewAllLink
        />
      </SectionWrapper>
    </>
  );
};

export default SampleModelPlan;
