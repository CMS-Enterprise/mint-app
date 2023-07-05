import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';

import Breadcrumbs from 'components/Breadcrumbs';
import PageHeading from 'components/PageHeading';
import GlobalClientFilter from 'components/TableFilter';
import { OperationalSolutionCategoryRoute } from 'data/operationalSolutionCategories';

import { operationalSolutionCategoryMap } from '../../solutionsMap';

import './index.scss';

type OperationalSolutionsHelpProps = {
  className?: string;
  category?: OperationalSolutionCategoryRoute | null;
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

  const categoryKey = category ? operationalSolutionCategoryMap[category] : '';

  const breadcrumbs = [
    { text: t('heading'), url: '/help-and-knowledge' },
    {
      text: t('operationalSolutions'),
      url: `/help-and-knowledge/operational-solutions`
    }
  ];

  if (categoryKey) {
    breadcrumbs.push({ text: t(`categories.${categoryKey}.header`), url: '' });
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
          className="help-header__breadcrumbs bg-primary-darker text-white padding-top-0 margin-top-neg-2 margin-bottom-4"
        />

        <PageHeading className="margin-0">
          {categoryKey
            ? t(`categories.${categoryKey}.header`)
            : t('operationalSolutions')}
        </PageHeading>

        <p className="margin-bottom-4 font-body-lg">
          {categoryKey
            ? t(`categories.${categoryKey}.description`)
            : t('operationalSolutionsInfo')}
        </p>

        {!category && (
          <div>
            <Grid tablet={{ col: 6 }}>
              <GlobalClientFilter
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
