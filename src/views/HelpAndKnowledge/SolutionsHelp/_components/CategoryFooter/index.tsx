import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, IconArrowForward } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import { operationalSolutionCategoryMap } from 'views/HelpAndKnowledge/Articles';

type CategoryFooterProps = {
  className?: string;
};

const CategoryFooter = ({ className }: CategoryFooterProps) => {
  const { t } = useTranslation('helpAndKnowledge');

  return (
    <div className={classNames(className, 'margin-top-4')}>
      <h2 className="margin-bottom-1">{t('browseCategories')}</h2>

      <Grid row>
        {operationalSolutionCategoryMap.map(category => (
          <Grid tablet={{ col: 6 }} key={category.key}>
            <UswdsReactLink
              className="display-flex flex-align-center margin-y-1"
              key={category.key}
              to={category.route}
            >
              {t(`categories.${category.key}`)}
              <IconArrowForward className="margin-left-1" />
            </UswdsReactLink>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default CategoryFooter;
