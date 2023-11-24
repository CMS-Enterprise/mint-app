import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import { OperationalSolutionCategoryRoute } from 'data/operationalSolutionCategories';
import { solutionCategories } from 'i18n/en-US/helpAndKnowledge/helpAndKnowledge';

import './index.scss';

type CategoryCardProps = {
  className?: string;
  category: string;
  route: OperationalSolutionCategoryRoute;
};

const CategoryCard = ({ className, category, route }: CategoryCardProps) => {
  const { t } = useTranslation('helpAndKnowledge');
  return (
    <Card
      className={classNames(
        className,
        'radius-sm width-full operational-solution-help__category'
      )}
    >
      <CardHeader className="text-bold padding-y-0 flex-2">
        {category}
      </CardHeader>

      {solutionCategories[route].subHeader && (
        <span className="padding-x-3">
          {t(`categories.${route}.subHeader`)}
        </span>
      )}

      <CardBody className="padding-y-0 flex-1 operational-solution-help__fill-card-space">
        <UswdsReactLink
          className="display-flex flex-align-center"
          to={`/help-and-knowledge/operational-solutions?category=${route}`}
          aria-label={`${t('learnMore')} about ${category}`}
        >
          {t('learnMore')}
          <Icon.ArrowForward className="margin-left-1" />
        </UswdsReactLink>
      </CardBody>
    </Card>
  );
};

export default CategoryCard;
