import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { MtoCommonSolutionSubject } from 'gql/generated/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import { solutionCategories } from 'i18n/en-US/helpAndKnowledge/helpAndKnowledge';

import './index.scss';

type CategoryCardProps = {
  className?: string;
  categoryKey: MtoCommonSolutionSubject;
};

const CategoryCard = ({ className, categoryKey }: CategoryCardProps) => {
  const { t } = useTranslation('helpAndKnowledge');
  return (
    <Card
      className={classNames(
        className,
        'radius-sm width-full operational-solution-help__category'
      )}
    >
      <CardHeader className="text-bold padding-y-0 flex-2">
        {t(`categories.${categoryKey}.header`)}
      </CardHeader>

      {solutionCategories[categoryKey].subHeader && (
        <span className="padding-x-3">
          {t(`categories.${categoryKey}.subHeader`)}
        </span>
      )}

      <CardBody className="padding-y-0 flex-1 operational-solution-help__fill-card-space">
        <UswdsReactLink
          className="display-flex flex-align-center"
          to={`/help-and-knowledge/operational-solutions?category=${categoryKey}`}
          aria-label={`${t('learnMore')} about ${categoryKey}`}
        >
          {t('learnMore')}
          <Icon.ArrowForward className="margin-left-1" aria-label="forward" />
        </UswdsReactLink>
      </CardBody>
    </Card>
  );
};

export default CategoryCard;
