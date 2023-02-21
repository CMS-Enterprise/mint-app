import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardHeader,
  IconArrowForward
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';

import './index.scss';

type CategoryCardProps = {
  className?: string;
  category: string;
  route: string;
};

const CategoryCard = ({ className, category, route }: CategoryCardProps) => {
  const { t } = useTranslation('helpAndKnowledge');
  return (
    <Card
      className={classNames(
        className,
        'radius-sm',
        'operational-solution-help__category'
      )}
    >
      <CardHeader className="text-bold padding-y-0 flex-2">
        {category}
      </CardHeader>
      <CardBody className="padding-y-0 flex-1">
        <UswdsReactLink
          className="display-flex flex-align-center"
          to={`/help-and-knowledge/operational-solutions/categories/${route}`}
        >
          {t('learnMore')}
          <IconArrowForward className="margin-left-1" />
        </UswdsReactLink>
      </CardBody>
    </Card>
  );
};

export default CategoryCard;
