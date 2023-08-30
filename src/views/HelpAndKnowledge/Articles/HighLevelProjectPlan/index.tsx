import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  Grid,
  GridContainer,
  IconFileDownload,
  Link
} from '@trussworks/react-uswds';

import HelpAndKnowledgeCategoryTag from 'components/HelpAndKnowledgeCategoryTag';
import HelpBreadcrumb from 'components/HelpBreadcrumb';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import RelatedArticles from 'components/RelatedArticles';
import ExternalLink from 'components/shared/ExternalLink';

import Table from './table';

interface AccordionItemProps {
  title: React.ReactNode | string;
  content: React.ReactNode;
  expanded: boolean;
  id: string;
  className?: string;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  handleToggle?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const HighLevelProjectPlan = () => {
  const { t: highLevelT } = useTranslation('highLevelProjectPlans');

  const accordionTitles: string[] = highLevelT('accordionItems.titles', {
    returnObjects: true
  });

  const accordionItemsMap = accordionTitles.map((item, index) => ({
    title: item,
    content: (
      <>
        {/* TODO: incorporate the link and copy */}
        {/* <Link
          href="https://innovation.cms.gov/strategic-direction"
          aria-label="Open in a new tab"
          target="_blank"
          rel="noopener noreferrer"
          className="display-flex flex-align-center width-fit-content margin-bottom-3"
          variant="external"
        >
          {highLevelT(
            'accordionItems.table.cmmi-internal-clearance-process.link'
          )}
        </Link> */}
        {item === 'CMMI Internal Clearance Process' && (
          <ExternalLink href={highLevelT('accordionItems.copy.cmmi.href')}>
            {highLevelT('accordionItems.copy.cmmi.copy')}
          </ExternalLink>
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
            href="https://docs.google.com/spreadsheets/d/143yWa6QmW44c5BWZVWc8Zl2jkg7VQM8io5xEn17lna4/edit?usp=sharing"
            aria-label="Open in a new tab"
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

          <Accordion bordered={false} multiselectable items={accordionItems} />
        </Grid>
      </GridContainer>
      <div className="margin-top-6 margin-bottom-neg-7">
        <RelatedArticles currentArticle={highLevelT('title')} viewAllLink />
      </div>
    </MainContent>
  );
};

export default HighLevelProjectPlan;
