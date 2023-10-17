import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CardGroup, GridContainer } from '@trussworks/react-uswds';
import classnames from 'classnames';

import ArticleCard from 'components/ArticleCard';
import helpAndKnowledgeArticles from 'views/HelpAndKnowledge/Articles';

type RelatedArticlesProps = {
  className?: string;
  currentArticle: string;
  viewAllLink?: boolean;
};

const RelatedArticles = ({
  className,
  currentArticle,
  viewAllLink
}: RelatedArticlesProps) => {
  const { t } = useTranslation('helpAndKnowledge');

  const selectedArticles = helpAndKnowledgeArticles
    .filter(article => article.name !== currentArticle)
    .slice(0, 3);

  return (
    <div className="bg-primary-lighter">
      <GridContainer className="padding-top-4 padding-bottom-10">
        <h2 className="margin-top-0 margin-bottom-1">{t('relatedHelp')}</h2>
        <dt className="margin-bottom-4">{t('relatedDescription')}</dt>
        <CardGroup className={classnames(className)}>
          {selectedArticles.map(article => (
            <ArticleCard key={article.route} {...article} isLink />
          ))}
        </CardGroup>
        {viewAllLink && (
          <Link to="/help-and-knowledge/articles">{t('viewAllRelated')}</Link>
        )}
      </GridContainer>
    </div>
  );
};

export default RelatedArticles;
