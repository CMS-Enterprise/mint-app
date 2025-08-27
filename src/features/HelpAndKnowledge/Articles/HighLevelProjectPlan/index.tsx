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
import HelpBreadcrumb from 'features/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';
import HelpCategoryTag from 'features/HelpAndKnowledge/Articles/_components/HelpCategoryTag';
import RelatedArticles from 'features/HelpAndKnowledge/Articles/_components/RelatedArticles';
import { findSolutionByRouteParam } from 'features/HelpAndKnowledge/SolutionsHelp';
import SolutionDetailsModal from 'features/HelpAndKnowledge/SolutionsHelp/SolutionDetails/Modal';

import ExcelFile from 'assets/files/high-level-project-plan.xlsx';
import ExternalLink from 'components/ExternalLink';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import useHelpSolution from 'hooks/useHelpSolutions';
import useModalSolutionState from 'hooks/useModalSolutionState';
import { tArray } from 'utils/translation';

import LatestContentUpdate from '../_components/LatestContentUpdate';
import { ArticleCategories, HelpArticle } from '..';

import Table from './table';

const HighLevelProjectPlan = () => {
  const { t: highLevelT } = useTranslation('highLevelProjectPlans');
  const { t: generalT } = useTranslation('general');
  const cmmiModelList = tArray<{ copy: string; href: string }>(
    'highLevelProjectPlans:accordionItems:copy:cmmiModel'
  );

  const { helpSolutions, loading } = useHelpSolution();

  const { prevPathname, selectedSolution: solution } = useModalSolutionState();

  // Solution to render in modal
  const selectedSolution = findSolutionByRouteParam(
    solution?.key || null,
    helpSolutions,
    true
  );

  const accordionTitles = tArray<string>(
    'highLevelProjectPlans:accordionItems.titles'
  );

  const accordionItemsMap: AccordionItemProps[] = accordionTitles.map(
    (item, index) => ({
      title: item,
      content: (
        <>
          {item === 'CMMI Model Operational Planning' &&
            cmmiModelList.map(linkItem => (
              <UswdsReactLink
                aria-label="Redirect to using the solution library article"
                to={linkItem.href}
                className="display-block margin-y-05"
              >
                {highLevelT(linkItem.copy)}
                <Icon.ArrowForward
                  className="top-3px margin-left-05"
                  aria-label="forward"
                />
              </UswdsReactLink>
            ))}
          {item === 'CMMI Internal Clearance Process' && (
            <ExternalLink
              href={highLevelT('accordionItems.copy.cmmiInternal.href')}
            >
              {highLevelT('accordionItems.copy.cmmiInternal.copy')}
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
              <Icon.FileDownload
                className="margin-right-1"
                aria-label="download"
              />
              <span>{highLevelT('downloadExcel')}</span>
            </Link>

            <p className="font-body-md margin-top-0 margin-bottom-3">
              {highLevelT('accordionHelp')}
            </p>

            <Accordion
              bordered={false}
              multiselectable
              items={accordionItems}
              className="margin-bottom-4"
            />

            <LatestContentUpdate file="highLevelProjectPlans.ts" />
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
