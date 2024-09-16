import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  Grid,
  GridContainer,
  Icon,
  Link
} from '@trussworks/react-uswds';
import { AccordionItemProps } from '@trussworks/react-uswds/lib/components/Accordion/Accordion';

import ExcelFile from 'assets/files/high-level-project-plan.xlsx';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import ExternalLink from 'components/shared/ExternalLink';
import useHelpSolution from 'hooks/useHelpSolutions';
import useModalSolutionState from 'hooks/useModalSolutionState';
import HelpBreadcrumb from 'views/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';
import HelpCategoryTag from 'views/HelpAndKnowledge/Articles/_components/HelpCategoryTag';
import RelatedArticles from 'views/HelpAndKnowledge/Articles/_components/RelatedArticles';
import { findSolutionByRouteParam } from 'views/HelpAndKnowledge/SolutionsHelp';
import SolutionDetailsModal from 'views/HelpAndKnowledge/SolutionsHelp/SolutionDetails/Modal';

import { ArticleCategories, HelpArticle } from '..';

import Table from './table';

const HighLevelProjectPlan = () => {
  const { t: highLevelT } = useTranslation('highLevelProjectPlans');
  const { t: generalT } = useTranslation('general');

  const { helpSolutions, loading } = useHelpSolution();

  const { prevPathname, selectedSolution: solution } =
    useModalSolutionState(null);

  // Solution to render in modal
  const selectedSolution = findSolutionByRouteParam(
    solution?.route || null,
    helpSolutions
  );

  const accordionTitles: string[] = highLevelT('accordionItems.titles', {
    returnObjects: true
  });

  const accordionItemsMap: AccordionItemProps[] = accordionTitles.map(
    (item, index) => ({
      title: item,
      content: (
        <>
          {item === 'CMMI Internal Clearance Process' && (
            <ExternalLink href={highLevelT('accordionItems.copy.cmmi.href')}>
              {highLevelT('accordionItems.copy.cmmi.copy')}
            </ExternalLink>
          )}
          {item === 'Clearance of Documents' && (
            <>
              <p className="margin-top-0 margin-bottom-1">
                {highLevelT('accordionItems.copy.documents.copy')}
              </p>
              <ExternalLink
                href={highLevelT('accordionItems.copy.documents.link.href')}
              >
                {highLevelT('accordionItems.copy.documents.link.copy')}
              </ExternalLink>
            </>
          )}
          {item === 'Legal' && <p>{highLevelT('accordionItems.copy.legal')}</p>}
          <Table content={`${item.toLowerCase().replace(/\s+/g, '-')}`} />
        </>
      ),
      expanded: index === 0,
      headingLevel: 'h4',
      id: `${item.toLowerCase().replace(/\s+/g, '-')}`
    })
  );

  const accordionItems: AccordionItemProps[] = [...accordionItemsMap];

  if (loading) {
    return <PageLoading />;
  }

  return (
    <>
      {selectedSolution && (
        <SolutionDetailsModal
          solution={selectedSolution}
          openedFrom={prevPathname}
          closeRoute="/help-and-knowledge/high-level-project-plan"
        />
      )}

      <MainContent>
        <GridContainer>
          <Grid>
            <HelpBreadcrumb text={highLevelT('title')} />
            <PageHeading className="margin-bottom-1">
              {highLevelT('title')}
            </PageHeading>
            <HelpCategoryTag
              type={ArticleCategories.GETTING_STARTED}
              className="margin-bottom-1"
            />
            <p className="font-body-lg line-height-sans-5 margin-top-0 margin-bottom-4">
              {highLevelT('description')}
            </p>

            <Link
              href={ExcelFile}
              aria-label={generalT('newTab')}
              target="_blank"
              rel="noopener noreferrer"
              className="display-flex flex-align-center width-fit-content margin-bottom-3"
            >
              <Icon.FileDownload className="margin-right-1" />
              <span>{highLevelT('downloadExcel')}</span>
            </Link>

            <p className="font-body-md margin-top-0 margin-bottom-3">
              {highLevelT('accordionHelp')}
            </p>

            <Accordion
              bordered={false}
              multiselectable
              items={accordionItems}
            />
          </Grid>
        </GridContainer>
        <div className="margin-top-6 margin-bottom-neg-7">
          <RelatedArticles
            currentArticle={HelpArticle.HIGH_LEVEL_PROJECT_PLAN}
            specificArticles={[
              HelpArticle.TWO_PAGER_MEETING,
              HelpArticle.MODEL_PLAN_OVERVIEW,
              HelpArticle.SAMPLE_MODEL_PLAN
            ]}
            viewAllLink
          />
        </div>
      </MainContent>
    </>
  );
};

export default HighLevelProjectPlan;
