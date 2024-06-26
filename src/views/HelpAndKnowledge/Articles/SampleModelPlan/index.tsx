import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import SectionWrapper from 'components/shared/SectionWrapper';
import HelpBreadcrumb from 'views/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';
import HelpCategoryTag from 'views/HelpAndKnowledge/Articles/_components/HelpCategoryTag';
import RelatedArticles from 'views/HelpAndKnowledge/Articles/_components/RelatedArticles';
import ReadOnly from 'views/ModelPlan/ReadOnly';

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
              type="getting-started"
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
          currentArticle={t('title')}
          specificArticleNames={[
            'How to have a successful 2-pager meeting',
            'High-level project plans',
            'Model Plan Overview'
          ]}
          viewAllLink
        />
      </SectionWrapper>
    </>
  );
};

export default SampleModelPlan;
