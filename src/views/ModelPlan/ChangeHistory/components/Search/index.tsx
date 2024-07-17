import React from 'react';
import { useTranslation } from 'react-i18next';

import GlobalClientFilter from 'components/TableFilter';

import { ChangeRecordType } from '../../util';

type SearchProps = {
  query: string | null;
  results: ChangeRecordType[][];
  currentResults: ChangeRecordType[][];
  resultsNum: number;
  itemsPerPage: number;
  pageOffset: number;
  setQuery: (query: string) => void;
};

const Search = ({
  query,
  results,
  currentResults,
  resultsNum,
  itemsPerPage,
  pageOffset,
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
                  resultsNum: (pageOffset / itemsPerPage) * 10 + 1,
                  count:
                    (pageOffset / itemsPerPage) * 10 + currentResults?.length,
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
