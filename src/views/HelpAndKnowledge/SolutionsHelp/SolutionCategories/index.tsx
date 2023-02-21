import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  CardGroup,
  Grid,
  GridContainer
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import OperationalSolutionCategories from 'data/operationalSolutionCategories';

import CategoryCard from '../_components/CategoryCard';
import { operationalSolutionCategoryMap } from '../solutionsMap';

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
          {Object.keys(operationalSolutionCategoryMap).map(key => {
            const category =
              operationalSolutionCategoryMap[
                key as OperationalSolutionCategories
              ];
            return (
              <Grid tablet={{ col: 3 }} key={key}>
                <CategoryCard
                  key={key}
                  category={t(`categories.${key}`)}
                  route={category.route}
                />
              </Grid>
            );
          })}
        </CardGroup>

        <Button type="button">{t('viewAllButton')}</Button>
      </GridContainer>
    </div>
  );
};

export default OperationalSolutionsHelp;
