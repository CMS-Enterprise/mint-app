import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { MtoCommonSolutionSubject } from 'gql/generated/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import { solutionCategories } from 'i18n/en-US/helpAndKnowledge/helpAndKnowledge';
import { getKeys } from 'types/translation';

type CategoryFooterProps = {
  className?: string;
  currentCategory?: MtoCommonSolutionSubject | string | null;
};

const CategoryFooter = ({
  className,
  currentCategory
}: CategoryFooterProps) => {
  const { t } = useTranslation('helpAndKnowledge');

  return (
    <div className={classNames(className, 'margin-top-4')}>
      <h2 className="margin-bottom-1">{t('browseCategories')}</h2>

      <Grid row>
        {getKeys(MtoCommonSolutionSubject)
          .filter(
            //  If current page is a category, don't list the category
            key => key !== currentCategory
          )
          .map(key => {
            return (
              <Grid tablet={{ col: 6 }} key={key}>
                <UswdsReactLink
                  className="fit-content display-flex flex-align-center margin-y-1"
                  key={key}
                  to={`/help-and-knowledge/operational-solutions?category=${key}`}
                >
                  <span>
                    {t(`categories.${key}.header`)}&nbsp;
                    {solutionCategories[key]?.subHeader &&
                      t(`categories.${key}.subHeader`)}
                    <Icon.ArrowForward
                      className="margin-left-1 top-2px"
                      aria-label="forward"
                    />
                  </span>
                </UswdsReactLink>
              </Grid>
            );
          })}
      </Grid>
    </div>
  );
};

export default CategoryFooter;
