import React from 'react';
import { useTranslation } from 'react-i18next';

import GlobalClientFilter from 'components/TableFilter';

type SearchProps = {
  query: string | null;
  results: any[];
  currentResults: any[];
  resultsNum: number;
  itemsPerPage: number;
  currentPage: number;
  setQuery: (query: string) => void;
};

const Search = ({
  query,
  results,
  currentResults,
  resultsNum,
  itemsPerPage,
  currentPage,
  setQuery
}: SearchProps) => {
  const { t } = useTranslation('changeHistory');

  return (
    <>
      {/* Search bar */}
      <GlobalClientFilter
        globalFilter={query}
        setGlobalFilter={setQuery}
        tableID="table-id"
        tableName="table-name"
        className="width-full maxw-mobile-lg margin-bottom-3 padding-top-1"
        initialFilter={query || ''}
      />

      {/* Results text */}
      {query && (
        <div className="display-flex padding-bottom-2">
          <p className="margin-y-0">
            {results.length > itemsPerPage
              ? t('resultsInfo', {
                  resultsNum: currentPage * 10 + 1,
                  count: currentPage * 10 + currentResults?.length,
                  total: resultsNum,
                  query: 'for'
                })
              : t('resultsNoInfo', {
                  resultsNum: results.length,
                  count: results.length,
                  query: 'for'
                })}
            {query && <span className="text-bold">{` "${query}"`}</span>}
          </p>
        </div>
      )}
    </>
  );
};

export default Search;
