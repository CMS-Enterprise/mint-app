import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { FilterValue } from 'react-table';
import classnames from 'classnames';

import Alert from 'components/Alert';

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
  const rows: number = rowLength || filteredRowLength;

  const currentPage: number = pageIndex * pageSize + 1;

  // If data or filter results are less than 10 (page size) - then default to the number of returned rows
  const pageRange: number = rows < pageSize ? rows : (pageIndex + 1) * pageSize;

  // Determine the number of rows to display on the current page.
  // If the calculated pageRange is less than the total number of rows, use pageRange.
  // Otherwise, use the total number of rows.
  // To account for times when it is "Showing 31-XX of 36 results"
  const displayedRowsCount = pageRange < rows ? pageRange : rows;

  return (
    <div className={classnames(className)} data-testid="page-results">
      <span>
        {rows === 0 ? (
          showNoResults && (
            <>
              <div role="status" aria-live="polite" className="margin-bottom-4">
                {t('tableAndPagination:results.noResults')}{' '}
                {/* Displays the search input even if there are no results */}
                {displayResult(globalFilter)}
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
              </div>
            </>
          )
        ) : (
          <div role="status" aria-live="polite" className="margin-bottom-2">
            {t('results.results', {
              currentPage,
              pageRange: displayedRowsCount,
              rows
            })}
            {displayResult(globalFilter)}
          </div>
        )}
      </span>
    </div>
  );
};

export default TableResults;
