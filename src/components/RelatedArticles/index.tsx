import React from 'react';
import { useTranslation } from 'react-i18next';
import { CardGroup } from '@trussworks/react-uswds';
import classnames from 'classnames';

import ArticleCard from 'components/ArticleCard';
import MainContent from 'components/MainContent';
import helpAndKnowledgeArticles from 'views/HelpAndKnowledge/Articles';

type RelatedArticlesProps = {
  className?: string;
  currentArticle: string;
};

const RelatedArticles = ({
  className,
  currentArticle
}: RelatedArticlesProps) => {
  const { t } = useTranslation('helpAndKnowledge');

  const selectedArticles = helpAndKnowledgeArticles
    .filter(article => article.name !== currentArticle)
    .slice(0, 3);

  return (
    <div className="bg-primary-lighter margin-bottom-neg-7">
      <MainContent className="grid-container padding-y-2">
        <h2 className="margin-bottom-1">{t('relatedHelp')}</h2>
        <dt className="margin-bottom-4">{t('relatedDescription')}</dt>
        <CardGroup className={classnames('margin-y-2', className)}>
          {selectedArticles.map(article => (
            <ArticleCard key={article.route} {...article} isLink />
          ))}
        </CardGroup>
      </MainContent>
    </div>
  );
};

export default RelatedArticles;
