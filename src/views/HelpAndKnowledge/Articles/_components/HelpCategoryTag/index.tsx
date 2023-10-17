import React from 'react';
import { useTranslation } from 'react-i18next';

import UswdsReactLink from 'components/LinkWrapper';
import Tag from 'components/shared/Tag';
import { ArticleTypeProps } from 'views/HelpAndKnowledge/Articles';

const articleTypes: ArticleTypeProps['type'][] = [
  'getting-started',
  'it-implementation'
];

export default function HelpCategoryTag({
  type,
  className
}: {
  type: ArticleTypeProps['type'];
  className?: string;
}) {
  const { t } = useTranslation('helpAndKnowledge');
  const articleType = articleTypes.filter(article => article === type)[0];
  return (
    <UswdsReactLink
      to={`/help-and-knowledge/articles?category=${articleType}`}
      className={`width-fit-content display-block ${className || ''}`}
    >
      <Tag
        className="article__tag bg-primary-lighter text-primary text-no-uppercase text-bold font-body-sm"
        arialabel={t(`Articles under the ${t(`${type}`)} category`)}
      >
        {t(`${type}`)}
      </Tag>
    </UswdsReactLink>
  );
}
