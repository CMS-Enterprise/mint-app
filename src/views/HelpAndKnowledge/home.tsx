import React from 'react';
import { useTranslation } from 'react-i18next';
import { GridContainer, SummaryBox } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

import ArticlePageInfo from './Articles/_components/ArticlePageInfo';
import HelpCardGroup from './Articles/_components/HelpCardGroup';
import SolutionCategories from './SolutionsHelp/_components/SolutionCategories';

export const HelpAndKnowledgeHome = () => {
  const { t } = useTranslation('helpAndKnowledge');

  return (
    <MainContent>
      <SummaryBox
        className="padding-y-6 border-0 bg-primary-lighter padding-x-0"
        data-testid="help-and-knowledge-summary"
      >
        <GridContainer>
          <PageHeading className="margin-0 line-height-sans-2">
            {t('heading')}
          </PageHeading>

          <div className="description-truncated margin-y-2 font-body-lg">
            {t('description')}
          </div>
        </GridContainer>
      </SummaryBox>
      <GridContainer className="padding-bottom-4">
        <h2 className="margin-bottom-0">
          {t('helpCategories.GETTING_STARTED')}
        </h2>

        <p className="margin-bottom-3 font-body-md">{t('instructions')}</p>

        <HelpCardGroup
          className="margin-top-2 margin-bottom-1"
          showFirstThree
        />
        <ArticlePageInfo />
      </GridContainer>

      <SolutionCategories />
    </MainContent>
  );
};

export default HelpAndKnowledgeHome;
