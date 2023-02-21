import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  CardGroup,
  Grid,
  GridContainer
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import { operationalSolutionCategoryMap } from '../../Articles';
import CategoryCard from '../_components/CategoryCard';

type OperationalSolutionsHelpProps = {
  className?: string;
};

const OperationalSolutionsHelp = ({
  className
}: OperationalSolutionsHelpProps) => {
  const { t } = useTranslation('helpAndKnowledge');

  return (
    <div
      className={classNames(
        className,
        'padding-y-4 padding-bottom-6 bg-primary-darker text-white margin-bottom-neg-7'
      )}
    >
      <GridContainer>
        <h2 className="margin-0">{t('operationalSolutions')}</h2>

        <p className="margin-bottom-4">{t('operationalSolutionsInfo')}</p>

        <CardGroup className={className}>
          {operationalSolutionCategoryMap.map(category => (
            <Grid tablet={{ col: 3 }} key={category.key}>
              <CategoryCard
                key={category.key}
                category={t(`categories.${category.key}`)}
                route={category.route}
              />
            </Grid>
          ))}
        </CardGroup>

        <Button type="button">{t('viewAllButton')}</Button>
      </GridContainer>
    </div>
  );
};

export default OperationalSolutionsHelp;
