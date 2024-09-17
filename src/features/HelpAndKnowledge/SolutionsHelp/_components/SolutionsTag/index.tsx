import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import {
  OperationalSolutionCategories,
  OperationalSolutionCategoryRoute
} from 'features/ModelPlan/TaskList/ITSolutions/operationalSolutionCategories';

import UswdsReactLink from 'components/LinkWrapper';
import Tag from 'components/Tag';
import { solutionCategories } from 'i18n/en-US/helpAndKnowledge/helpAndKnowledge';

type SolutionsTagProps = {
  className?: string;
  route: OperationalSolutionCategoryRoute;
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
      aria-label={t(
        `Articles under the ${t(`categories.${category}.header`)} category`
      )}
      className={classNames(
        className,
        'display-block margin-right-05 margin-bottom-1'
      )}
      data-testid="solutions-tag"
    >
      <Tag className="article__tag bg-primary-lighter text-primary text-no-uppercase text-bold font-body-sm margin-right-0 width-fit-content line-height-sans-2">
        {t(`categories.${category}.header`)}

        {solutionCategories[category as OperationalSolutionCategoryRoute]
          ?.subHeader && <span> {t(`categories.${category}.subHeader`)}</span>}
      </Tag>
    </UswdsReactLink>
  );
}
