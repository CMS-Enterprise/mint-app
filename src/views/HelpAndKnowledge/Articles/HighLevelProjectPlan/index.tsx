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
    content: <Table content={`${item.toLowerCase().replace(/\s+/g, '-')}`} />,
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

          {/* TODO: Change link to the shared drive excel sheet */}
          <Link
            href="https://innovation.cms.gov/strategic-direction"
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
