import React from 'react';
import { useTranslation } from 'react-i18next';
import { GridContainer, SummaryBox } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import ScrollLink from 'components/ScrollLink';
import { convertToLowercaseAndDashes } from 'utils/modelPlan';

import KeyContactDirectory from './_components/KeyContactDirectory';
import MilestoneLibrarySection from './_components/MilestoneLibrarySection';
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
            <ScrollLink scrollTo={t('helpResourcesAndLinks')} hasIcon={false} />

            <div className="display-inline height-full width-1px border-left border-width-1px border-base-light margin-x-2" />
            <ScrollLink
              scrollTo={t('milestoneLibrary.hkcJumpToLabel')}
              hasIcon={false}
            />

            <div className="display-inline height-full width-1px border-left border-width-1px border-base-light margin-x-2" />

            <ScrollLink
              scrollTo={t('operationalSolutionsAndITSystems')}
              hasIcon={false}
            />
          </div>
        </GridContainer>
      </SummaryBox>

      <GridContainer
        id={convertToLowercaseAndDashes(t('helpResourcesAndLinks'))}
        className="padding-top-2"
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

      <MilestoneLibrarySection />

      <SolutionCategories />

      <KeyContactDirectory />
    </MainContent>
  );
};

export default HelpAndKnowledgeHome;
