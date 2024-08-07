import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { FilterValue } from 'react-table';
import classnames from 'classnames';

import Alert from 'components/shared/Alert';

type TableResultsProps = {
  className?: string;
  globalFilter: FilterValue;
  pageIndex: number;
  pageSize: number;
  filteredRowLength: number;
  rowLength: number;
  showNoResults?: boolean;
};

const displayResult = (searchTerm: FilterValue) =>
  searchTerm ? (
    <span>
      <Trans i18nKey="tableAndPagination:results.searchInput" />{' '}
      <strong>&quot;{searchTerm}&quot;</strong>{' '}
    </span>
  ) : (
    ''
  );

const TableResults = ({
  className,
  globalFilter,
  pageIndex,
  pageSize,
  filteredRowLength,
  rowLength,
  showNoResults = true
}: TableResultsProps) => {
  const { t } = useTranslation('tableAndPagination');

  // Sets the max results to either the filtered dataset or default (depending on if filtering)
  const rows: number = globalFilter ? filteredRowLength : rowLength;

  const currentPage: number = pageIndex * pageSize + 1;

  // If data or filter results are less than 10 (page size) - then default to the number of returned rows
  const pageRange: number = rows < pageSize ? rows : (pageIndex + 1) * pageSize;

  return (
    <div className={classnames(className)} data-testid="page-results">
      <span>
        {rows === 0 ? (
          showNoResults && (
            <>
              <div role="status" aria-live="polite">
                {t('tableAndPagination:results.noResults')}{' '}
                {/* Displays the search input even if there are no results */}
                {displayResult(globalFilter)}
              </div>
              {globalFilter && (
                <Alert
                  type="warning"
                  heading={t('results.alertHeading', {
                    query: globalFilter
                  })}
                >
                  {t('results.alertDescription')}
                </Alert>
              )}
            </>
          )
        ) : (
          <div role="status" aria-live="polite">
            <Trans
              t={t}
              i18nKey="results.results"
              values={{
                currentPage,
                pageRange,
                rows
              }}
            />
            {displayResult(globalFilter)}
          </div>
        )}
      </span>
    </div>
  );
};

export default TableResults;
