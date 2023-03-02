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
      className={classNames(className, 'width-fit-content display-block')}
    >
      <Tag className="article__tag bg-primary-lighter text-primary text-no-uppercase text-bold font-body-sm">
        {t(`categories.${category}.header`)}
      </Tag>
    </UswdsReactLink>
  );
}
