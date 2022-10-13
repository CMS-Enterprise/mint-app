import React from 'react';
import { useTranslation } from 'react-i18next';
import { CardGroup, GridContainer, SummaryBox } from '@trussworks/react-uswds';

import ArticleCard from 'components/ArticleCard';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

import helpAndKnowledgeArticles from './Articles';

export const HelpAndKnowledgeHome = () => {
  const { t } = useTranslation('helpAndKnowledge');
  return (
    <MainContent>
      <SummaryBox
        heading=""
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
      <GridContainer>
        <CardGroup className="margin-y-2">
          {helpAndKnowledgeArticles.map(article => (
            <ArticleCard key={article.route} {...article} isLink />
          ))}
        </CardGroup>
      </GridContainer>
    </MainContent>
  );
};

export default HelpAndKnowledgeHome;
