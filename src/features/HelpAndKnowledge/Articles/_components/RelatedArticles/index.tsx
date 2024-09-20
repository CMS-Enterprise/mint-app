import React from 'react';
import { useTranslation } from 'react-i18next';
import { CardGroup, GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';
import helpAndKnowledgeArticles, {
  ArticleCategories,
  ArticleProps,
  HelpArticle
} from 'features/HelpAndKnowledge/Articles';
import ArticleCard from 'features/HelpAndKnowledge/Articles/_components/ArticleCard';

import UswdsReactLink from 'components/LinkWrapper';

type RelatedArticlesProps = {
  className?: string;
  currentArticle?: HelpArticle;
  specificArticles?: [HelpArticle, HelpArticle, HelpArticle];
  type?: ArticleCategories;
  viewAllLink?: boolean;
  implementationType?: 'Help Center' | 'Additional Resources';
};

const RelatedArticles = ({
  className,
  currentArticle,
  specificArticles,
  type,
  viewAllLink,
  implementationType = 'Help Center'
}: RelatedArticlesProps) => {
  const { t } = useTranslation('helpAndKnowledge');

  // Filter to only the category tag type
  let filteredArticles = type
    ? helpAndKnowledgeArticles.filter(article => article.type === type)
    : helpAndKnowledgeArticles;

  // If the only article is the current article, default to all articles
  if (filteredArticles.length <= 1) {
    filteredArticles = helpAndKnowledgeArticles;
  }

  // Slice to first 3 of the relevant articles
  filteredArticles = currentArticle
    ? filteredArticles
        .filter(article => article.key !== currentArticle)
        .slice(0, 3)
    : filteredArticles.slice(0, 3);

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

  const bgClass: string =
    implementationType === 'Additional Resources'
      ? 'bg-base-lightest'
      : 'bg-primary-lighter';

  return (
    <div className={classNames(bgClass, className)}>
      <GridContainer className="padding-top-4 padding-bottom-10">
        <h2 className="margin-top-0 margin-bottom-1">
          {implementationType === 'Additional Resources'
            ? t('addtionalResources')
            : t('relatedHelp')}
        </h2>

        <dt className="margin-bottom-4">{t('relatedDescription')}</dt>

        <CardGroup>
          {articlesToShow.map(article => (
            <ArticleCard {...article} isLink key={article.key} />
          ))}
        </CardGroup>

        {viewAllLink && (
          <div className="margin-top-3">
            <UswdsReactLink to="/help-and-knowledge/articles">
              {t('viewAllRelated')}
            </UswdsReactLink>
          </div>
        )}
      </GridContainer>
    </div>
  );
};

export default RelatedArticles;
