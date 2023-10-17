import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import HelpAndKnowledgeCategoryTag from 'components/HelpAndKnowledgeCategoryTag';
import HelpBreadcrumb from 'components/HelpBreadcrumb';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import RelatedArticles from 'components/RelatedArticles';
import SectionWrapper from 'components/shared/SectionWrapper';
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
            <HelpAndKnowledgeCategoryTag
              type="gettingStarted"
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
        <RelatedArticles currentArticle={t('title')} viewAllLink />
      </SectionWrapper>
    </>
  );
};

export default SampleModelPlan;
