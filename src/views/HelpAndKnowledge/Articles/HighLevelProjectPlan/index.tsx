import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  Grid,
  GridContainer,
  IconFileDownload,
  Link
} from '@trussworks/react-uswds';

import ExcelFile from 'assets/files/highLevelProjectPlan.xlsx';
import HelpAndKnowledgeCategoryTag from 'components/HelpAndKnowledgeCategoryTag';
import HelpBreadcrumb from 'components/HelpBreadcrumb';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import RelatedArticles from 'components/RelatedArticles';
import ExternalLink from 'components/shared/ExternalLink';
import useHelpSolution from 'hooks/useHelpSolutions';
import useModalSolutionState from 'hooks/useModalSolutionState';
import { findSolutionByRouteParam } from 'views/HelpAndKnowledge/SolutionsHelp';
import SolutionDetailsModal from 'views/HelpAndKnowledge/SolutionsHelp/SolutionDetails/Modal';

import Table from './table';

interface AccordionItemProps {
  title: React.ReactNode | string;
  content: React.ReactNode;
  expanded: boolean;
  id: string;
  className?: string;
}

const HighLevelProjectPlan = () => {
  const { t: highLevelT } = useTranslation('highLevelProjectPlans');
  const { t: generalT } = useTranslation('general');

  const helpSolutions = useHelpSolution();

  const { prevPathname, selectedSolution: solution } = useModalSolutionState(
    null
  );

  // Solution to render in modal
  const selectedSolution = findSolutionByRouteParam(
    solution?.route || null,
    helpSolutions
  );

  const accordionTitles: string[] = highLevelT('accordionItems.titles', {
    returnObjects: true
  });

  const accordionItemsMap = accordionTitles.map((item, index) => ({
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
    id: `${item.toLowerCase().replace(/\s+/g, '-')}`
  }));

  const accordionItems: AccordionItemProps[] = [...accordionItemsMap];

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
            <HelpAndKnowledgeCategoryTag
              type="gettingStarted"
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
              <IconFileDownload className="margin-right-1" />
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
          <RelatedArticles currentArticle={highLevelT('title')} viewAllLink />
        </div>
      </MainContent>
    </>
  );
};

export default HighLevelProjectPlan;
