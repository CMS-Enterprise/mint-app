import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import Tag from 'components/shared/Tag';
import OperationalSolutionCategories from 'data/operationalSolutionCategories';

type SolutionsTagProps = {
  className?: string;
  route: string;
  category: OperationalSolutionCategories;
};

export default function SolutionsTag({
  route,
  category,
  className
}: SolutionsTagProps) {
  const { t } = useTranslation('helpAndKnowledge');
  return (
    <UswdsReactLink
      to={`/help-and-knowledge/operational-solutions?category=${route}`}
      aria-label="Category tag link"
      className={classNames(
        className,
        'display-block margin-right-05 margin-bottom-1'
      )}
    >
      <Tag className="article__tag bg-primary-lighter text-primary text-no-uppercase text-bold font-body-sm margin-right-0 width-fit-content line-height-sans-2">
        {t(`categories.${category}.header`)}
      </Tag>
    </UswdsReactLink>
  );
}
