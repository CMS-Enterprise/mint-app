import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import Tag from 'components/Tag';
import { solutionCategories } from 'i18n/en-US/helpAndKnowledge/helpAndKnowledge';
import {
  OperationalSolutionCategories,
  OperationalSolutionCategoryRoute
} from 'types/operationalSolutionCategories';

type SolutionsTagProps = {
  className?: string;
  isBold?: boolean;
  route: OperationalSolutionCategoryRoute;
  category: OperationalSolutionCategories;
};

export default function SolutionsTag({
  route,
  category,
  className,
  isBold = true
}: SolutionsTagProps) {
  const { t } = useTranslation('helpAndKnowledge');
  return (
    <UswdsReactLink
      to={`/help-and-knowledge/operational-solutions?category=${route}`}
      aria-label={t(
        `Articles under the ${t(`categories.${category}.header`)} category`
      )}
      className="display-block margin-right-05 margin-bottom-1"
      data-testid="solutions-tag"
    >
      <Tag
        className={classNames(
          className,
          'article__tag bg-primary-lighter text-primary text-no-uppercase font-body-sm margin-right-0 width-fit-content line-height-sans-2',
          {
            'text-bold': isBold,
            'text-normal': !isBold
          }
        )}
      >
        {t(`categories.${category}.header`)}

        {solutionCategories[category as OperationalSolutionCategoryRoute]
          ?.subHeader && <span> {t(`categories.${category}.subHeader`)}</span>}
      </Tag>
    </UswdsReactLink>
  );
}
