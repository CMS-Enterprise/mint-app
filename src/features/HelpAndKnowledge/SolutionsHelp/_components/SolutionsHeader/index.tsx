import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { MtoCommonSolutionSubject } from 'gql/generated/graphql';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import PageHeading from 'components/PageHeading';
import GlobalClientFilter from 'components/TableFilter';
import { solutionCategories } from 'i18n/en-US/helpAndKnowledge/helpAndKnowledge';

import './index.scss';

type OperationalSolutionsHelpProps = {
  className?: string;
  category?: MtoCommonSolutionSubject;
  resultsNum: number;
  resultsMax: number;
  setQuery: (query: string) => void;
  query: string;
};

const SolutionsHeader = ({
  className,
  category,
  resultsNum,
  resultsMax,
  setQuery,
  query
}: OperationalSolutionsHelpProps) => {
  const { t } = useTranslation('helpAndKnowledge');

  const breadcrumbs = [
    BreadcrumbItemOptions.HELP_CENTER,
    BreadcrumbItemOptions.HELP_SOLUTIONS
  ];

  let crumbText = '';
  if (category) {
    crumbText = t(`categories.${category}.header`);

    if (solutionCategories[category]?.subHeader) {
      crumbText += ` ${t(`categories.${category}.subHeader`)}`;
    }
  }

  return (
    <div
      className={classNames(
        className,
        'padding-y-4 padding-bottom-4 bg-primary-darker text-white'
      )}
    >
      <GridContainer>
        <Breadcrumbs
          items={breadcrumbs}
          customItem={crumbText}
          className="help-header__breadcrumbs bg-primary-darker text-white padding-top-0 margin-top-neg-2 margin-bottom-4"
        />

        <PageHeading className="margin-0">
          {category
            ? t(`categories.${category}.header`)
            : t('operationalSolutions')}
        </PageHeading>

        {category && solutionCategories[category]?.subHeader && (
          <span className="font-body-xl">
            {t(`categories.${category}.subHeader`)}
          </span>
        )}

        <p className="margin-bottom-4 font-body-lg">
          {category
            ? t(`categories.${category}.description`)
            : t('operationalSolutionsInfo')}
        </p>

        {!category && (
          <div>
            <Grid tablet={{ col: 6 }}>
              <GlobalClientFilter
                globalFilter={query}
                setGlobalFilter={setQuery}
                tableID="table-id"
                tableName="table-name"
                className="width-full maxw-none margin-bottom-3"
              />
            </Grid>

            {/* Search results info */}
            <div className="display-flex">
              {!query ? (
                <p className="margin-y-0">
                  {t('resultsInfo', {
                    resultsNum,
                    resultsMax
                  })}
                </p>
              ) : (
                <p className="margin-y-0">
                  {t('queryResultsInfo', {
                    resultsNum,
                    plural: resultsNum === 1 ? '' : 's'
                  })}
                  <span className="text-bold">{`"${query}"`}</span>
                </p>
              )}
            </div>
          </div>
        )}
      </GridContainer>
    </div>
  );
};

export default SolutionsHeader;
