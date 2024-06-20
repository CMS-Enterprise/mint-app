import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CardGroup, GridContainer } from '@trussworks/react-uswds';
import classnames from 'classnames';

import helpAndKnowledgeArticles, {
  ArticleCategories,
  ArticleProps,
  HelpArticle
} from 'views/HelpAndKnowledge/Articles';
import ArticleCard from 'views/HelpAndKnowledge/Articles/_components/ArticleCard';

type RelatedArticlesProps = {
  className?: string;
  currentArticle: HelpArticle;
  specificArticles?: [HelpArticle, HelpArticle, HelpArticle];
  type?: ArticleCategories;
  viewAllLink?: boolean;
};

const RelatedArticles = ({
  className,
  currentArticle,
  specificArticles,
  type,
  viewAllLink
}: RelatedArticlesProps) => {
  const { t } = useTranslation('helpAndKnowledge');

  if (specificArticles?.length !== 3) {
    return null;
  }

  // Filter to only the category tag type
  let filteredArticles = type
    ? helpAndKnowledgeArticles.filter(article => article.type === type)
    : helpAndKnowledgeArticles;

  // If the only article is the current article, default to all articles
  if (filteredArticles.length <= 1) {
    filteredArticles = helpAndKnowledgeArticles;
  }

  // Slice to first 3 of the relevant articles
  filteredArticles = filteredArticles
    .filter(article => article.key !== currentArticle)
    .slice(0, 3);

  // It first checks if `specificArticles` is defined, and if so, it maps over each article name to find the corresponding article object in `helpAndKnowledgeArticles`.
  // It then filters out any undefined values and assigns the result to `articlesToShow`.
  // If `specificArticles` is not defined, it assigns `filteredArticles` to `articlesToShow`.
  const articlesToShow: ArticleProps[] =
    specificArticles
      ?.map(articleKey =>
        helpAndKnowledgeArticles.find(article => article.key === articleKey)
      )
      .filter((article): article is ArticleProps => !!article) ?? // Filter out undefined values // Filter out undefined values
    filteredArticles;

  return (
    <div className="bg-primary-lighter">
      <GridContainer className="padding-top-4 padding-bottom-10">
        <h2 className="margin-top-0 margin-bottom-1">{t('relatedHelp')}</h2>
        <dt className="margin-bottom-4">{t('relatedDescription')}</dt>
        <CardGroup className={classnames(className)}>
          {articlesToShow.map(article => (
            <ArticleCard {...article} isLink />
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
