import React from 'react';
import { CardGroup } from '@trussworks/react-uswds';

import ArticleCard from 'components/ArticleCard';

import helpAndKnowledgeArticles from '../..';

type HelpCardGroupType = {
  className?: string;
  filter?: string;
  showFirstThree?: boolean;
  tag?: boolean;
};

const HelpCardGroup = ({
  className,
  filter,
  showFirstThree,
  tag
}: HelpCardGroupType) => {
  const articles = filter
    ? helpAndKnowledgeArticles.filter(article => article.type === filter)
    : helpAndKnowledgeArticles;

  const firstThreeArticles = showFirstThree ? articles.slice(0, 3) : articles;

  return (
    <CardGroup className={className}>
      {firstThreeArticles.map(article => (
        <ArticleCard
          key={article.route}
          {...article}
          isLink
          tag={tag}
          type={article.type}
        />
      ))}
    </CardGroup>
  );
};

export default HelpCardGroup;
