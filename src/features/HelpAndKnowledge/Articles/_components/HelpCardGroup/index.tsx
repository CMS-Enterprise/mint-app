import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CardGroup } from '@trussworks/react-uswds';
import ArticleCard from 'features/HelpAndKnowledge/Articles/_components/ArticleCard';

import usePagination from 'hooks/usePagination';

import helpAndKnowledgeArticles, { ArticleProps, HelpArticle } from '../..';

type HelpCardGroupType = {
  className?: string;
  filter?: string | null;
  showFirstThree?: boolean;
  tag?: boolean;
  pagination?: boolean;
};

const HelpCardGroup = ({
  className,
  filter,
  showFirstThree,
  tag,
  pagination = false
}: HelpCardGroupType) => {
  const { t } = useTranslation('helpAndKnowledge');

  const articleNames: Record<HelpArticle, string> = t('helpArticleNames', {
    returnObjects: true
  });

  helpAndKnowledgeArticles.sort((a, b) =>
    articleNames[a.key]
      .toLowerCase()
      .localeCompare(articleNames[b.key].toLowerCase())
  );

  const articles = useMemo(() => {
    return filter
      ? helpAndKnowledgeArticles.filter(article => article.type === filter)
      : helpAndKnowledgeArticles;
  }, [filter]);

  const { currentItems, Pagination } = usePagination<ArticleProps[]>({
    items: articles,
    itemsPerPage: 9,
    withQueryParams: 'page'
  });

  const firstThreeArticles = showFirstThree
    ? currentItems.slice(0, 3)
    : currentItems;

  return (
    <>
      <CardGroup className={className}>
        {firstThreeArticles.map(article => (
          <ArticleCard
            {...article}
            isLink
            tag={tag}
            type={article.type}
            key={article.key}
          />
        ))}
      </CardGroup>

      {pagination && Pagination}
    </>
  );
};

export default HelpCardGroup;
