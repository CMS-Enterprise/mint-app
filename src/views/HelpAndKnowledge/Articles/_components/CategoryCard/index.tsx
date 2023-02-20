import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';

type CategoryCardProps = {
  className?: string;
  category: string;
  route: string;
};

const CategoryCard = ({ className, category, route }: CategoryCardProps) => {
  const { t } = useTranslation('helpAndKnowledge');
  return (
    <Card className={classNames(className)}>
      <CardHeader>{category}</CardHeader>
      <CardBody>
        <UswdsReactLink
          to={`/help-and-knowledge/operational-solution/categories/${route}`}
        >
          {t('learnMore')}
        </UswdsReactLink>
      </CardBody>
    </Card>
  );
};

export default CategoryCard;
