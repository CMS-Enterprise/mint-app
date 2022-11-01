import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, GridContainer } from '@trussworks/react-uswds';

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
            <PageHeading>{t('title')}</PageHeading>
            <p className="font-body-lg line-height-sans-5 margin-top-0 margin-bottom-6">
              {t('description')}
            </p>
            {/* insert read only model plan here */}
          </Grid>
        </GridContainer>
      </MainContent>
      <ReadOnly isHelpArticle />
      <SectionWrapper className="margin-top-6">
        <RelatedArticles currentArticle={t('title')} />
      </SectionWrapper>
    </>
  );
};

export default SampleModelPlan;
