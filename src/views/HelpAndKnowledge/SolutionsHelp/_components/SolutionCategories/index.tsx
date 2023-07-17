import React from 'react';
import { useTranslation } from 'react-i18next';
import { CardGroup, Grid, GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import { OperationalSolutionCategoryRoute } from 'data/operationalSolutionCategories';

import { operationalSolutionCategoryMap } from '../../solutionsMap';
import CategoryCard from '../CategoryCard';

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

        <p className="margin-bottom-4 font-body-md">
          {t('operationalSolutionsInfo')}
        </p>

        <CardGroup className={className}>
          {Object.keys(operationalSolutionCategoryMap).map(key => {
            return (
              <Grid
                tablet={{ col: 6 }}
                desktop={{ col: 3 }}
                key={key}
                className="display-flex flex-align-stretch"
              >
                <CategoryCard
                  key={key}
                  category={t(`categories.${key}.header`)}
                  route={key as OperationalSolutionCategoryRoute}
                />
              </Grid>
            );
          })}
        </CardGroup>

        <UswdsReactLink
          to="/help-and-knowledge/operational-solutions?page=1"
          variant="unstyled"
          className="usa-button text-white"
        >
          {t('viewAllButton')}
        </UswdsReactLink>
      </GridContainer>
    </div>
  );
};

export default OperationalSolutionsHelp;
