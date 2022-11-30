import React from 'react';
import { CardGroup } from '@trussworks/react-uswds';

import ArticleCard from 'components/ArticleCard';

import helpAndKnowledgeArticles from '../..';

type HelpCardGroupType = {
  className?: string;
  filter?: string;
  tag?: boolean;
};

const HelpCardGroup = ({ className, filter, tag }: HelpCardGroupType) => {
  const articles = filter
    ? helpAndKnowledgeArticles.filter(article => article.type === filter)
    : helpAndKnowledgeArticles;

  return (
    <CardGroup className={className}>
      {articles.map(article => (
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
