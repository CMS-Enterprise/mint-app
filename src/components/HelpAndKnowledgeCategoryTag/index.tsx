import React from 'react';
import { useTranslation } from 'react-i18next';

import UswdsReactLink from 'components/LinkWrapper';
import Tag from 'components/shared/Tag';
import { ArticleTypeProps } from 'views/HelpAndKnowledge/Articles';

export type ArticleRouteProps = {
  type: string;
  route: string;
};

const articleTypes: ArticleRouteProps[] = [
  {
    type: 'gettingStarted',
    route: 'getting-started'
  },
  {
    type: 'itImplementation',
    route: 'it-implementation'
  }
];

export default function HelpAndKnowledgeCategoryTag({
  type,
  className
}: { className?: string } & ArticleTypeProps) {
  const { t } = useTranslation('helpAndKnowledge');
  const articleType = articleTypes.filter(article => article.type === type)[0];
  return (
    <UswdsReactLink
      to={`/help-and-knowledge/${articleType.route}`}
      className={`width-fit-content display-block ${className || ''}`}
    >
      <Tag className="article__tag bg-primary-lighter text-primary text-no-uppercase text-bold font-body-sm">
        {t(`${type}`)}
      </Tag>
    </UswdsReactLink>
  );
}
