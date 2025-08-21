import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, GridContainer, SummaryBox } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

import ArticlePageInfo from './Articles/_components/ArticlePageInfo';
import HelpCardGroup from './Articles/_components/HelpCardGroup';
import ResourcesByCategory from './Articles/_components/ResourcesByCategory';
import SolutionCategories from './SolutionsHelp/_components/SolutionCategories';
import { homeArticles } from './Articles';

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

          <div>
            <p className="display-inline text-bold margin-right-2">
              {t('jumpTo')}:
            </p>
            <Button
              type="button"
              onClick={() =>
                document.querySelector('#help-resources')?.scrollIntoView({
                  behavior: 'smooth'
                })
              }
              unstyled
            >
              {t('helpResourcesAndLinks')}
            </Button>

            <div className="display-inline height-full width-1px border-left border-width-1px border-base-light margin-x-2" />

            <Button
              type="button"
              onClick={() =>
                document
                  .querySelector('#operational-solutions')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              unstyled
            >
              {t('operationalSolutionsAndITSystems')}
            </Button>
          </div>
        </GridContainer>
      </SummaryBox>
      <GridContainer
        id="help-resources"
        className="padding-bottom-4 padding-top-2"
        style={{ scrollMarginTop: '3.5rem' }}
      >
        <HelpCardGroup
          className="margin-top-2 margin-bottom-1"
          resources={homeArticles}
          homeItems
        />
        <ArticlePageInfo />

        <ResourcesByCategory />
      </GridContainer>

      <SolutionCategories />
    </MainContent>
  );
};

export default HelpAndKnowledgeHome;
