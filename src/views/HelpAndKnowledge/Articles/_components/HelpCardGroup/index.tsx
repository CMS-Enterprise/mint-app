import React from 'react';
import { CardGroup } from '@trussworks/react-uswds';

import ArticleCard from 'components/ArticleCard';

import helpAndKnowledgeArticles from '../..';

type HelpCardGroupType = {
  className?: string;
};

const HelpCardGroup = ({ className }: HelpCardGroupType) => {
  return (
    <CardGroup className={className}>
      {helpAndKnowledgeArticles.map(article => (
        <ArticleCard key={article.route} {...article} isLink />
      ))}
    </CardGroup>
  );
};

export default HelpCardGroup;
