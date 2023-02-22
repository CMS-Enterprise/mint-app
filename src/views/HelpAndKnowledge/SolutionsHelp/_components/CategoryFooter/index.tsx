import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, IconArrowForward } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import OperationalSolutionCategories from 'data/operationalSolutionCategories';

import { operationalSolutionCategoryMap } from '../../solutionsMap';

type CategoryFooterProps = {
  className?: string;
};

const CategoryFooter = ({ className }: CategoryFooterProps) => {
  const { t } = useTranslation('helpAndKnowledge');

  return (
    <div className={classNames(className, 'margin-top-4')}>
      <h2 className="margin-bottom-1">{t('browseCategories')}</h2>

      <Grid row>
        {Object.keys(operationalSolutionCategoryMap).map(key => (
          <Grid tablet={{ col: 6 }} key={key}>
            <UswdsReactLink
              className="fit-content display-flex flex-align-center margin-y-1"
              key={key}
              to={`/help-and-knowledge/operational-solutions/categories/${
                operationalSolutionCategoryMap[
                  key as OperationalSolutionCategories
                ].route
              }`}
            >
              {t(`categories.${key}.header`)}
              <IconArrowForward className="margin-left-1" />
            </UswdsReactLink>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default CategoryFooter;
