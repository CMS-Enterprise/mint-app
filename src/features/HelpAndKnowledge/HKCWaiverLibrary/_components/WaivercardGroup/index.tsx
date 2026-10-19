import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { CardGroup, Grid, Link } from '@trussworks/react-uswds';
import WaiverInfoPanel from 'features/ModelPlan/AdditionalQuestionnaires/WaiverAssessmentSurvey/_components/WaiverInfoPanel';
import { CommonWaiverType } from 'gql/generated/graphql';

import { Alert } from 'components/Alert';
import FilterButtonWithModal from 'components/FilterButtonWithModal';
import FilterTags from 'components/FilterTags';
import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import usePagination from 'hooks/usePagination';

import type { CommonWaiverData } from '../..';
import {
  buildSearchParamsFromFilters,
  filterCommonWaivers,
  parseAppliedFilters,
  searchCommonWaivers
} from '../CommonWaiverFilters/_utils';
import getCommonWaiverFilters from '../CommonWaiverFilters/getCommonWaiverFilters';
import WaiverCard from '../WaiverCard';

const DEFAULT_ITEMS_PER_PAGE = 6;

export type CommonWaiverFilters = {
  type: CommonWaiverType[];
  focus: string[];
  other: string[];
};

const WaiverCardGroup = ({
  commonWaivers
}: {
  commonWaivers: CommonWaiverData[];
}) => {
  const { t: waiverLibraryMiscT } = useTranslation('waiverLibraryMisc');

  const [query, setQuery] = useState('');

  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  const [searchParams, setSearchParams] = useSearchParams();

  const activeWaiverId = searchParams.get('waiverId');

  const appliedFilters = useMemo(
    () => parseAppliedFilters(searchParams),
    [searchParams]
  );

  const setAppliedFilters = (filters: CommonWaiverFilters) => {
    const nextParams = buildSearchParamsFromFilters(filters, searchParams);
    setSearchParams(nextParams, { replace: true });
  };

  const filterOptions = useMemo(
    () => getCommonWaiverFilters(commonWaivers),
    [commonWaivers]
  );

  const hasActiveFilters = Object.values(appliedFilters).some(
    filterArray => filterArray.length > 0
  );

  const filteredSearchedCommonWaivers = useMemo(() => {
    let result = commonWaivers;

    if (hasActiveFilters) {
      result = filterCommonWaivers(appliedFilters, result);
    }

    if (query) {
      result = searchCommonWaivers(query, result);
    }

    return result;
  }, [commonWaivers, hasActiveFilters, appliedFilters, query]);

  const {
    currentItems,
    Pagination: PaginationComponent,
    pagination: { currentPage }
  } = usePagination<CommonWaiverData[]>({
    items: filteredSearchedCommonWaivers,
    itemsPerPage,
    withQueryParams: 'page',
    showPageIfOne: true
  });

  return (
    <>
      {activeWaiverId && <WaiverInfoPanel />}

      {/* Filter and Search */}
      <div className="margin-bottom-3">
        <Grid className="display-flex flex-wrap flex-align-center margin-bottom-3">
          <FilterButtonWithModal
            className="margin-right-1"
            filters={filterOptions}
            appliedFilters={appliedFilters}
            setAppliedFilters={setAppliedFilters}
          />
          <GlobalClientFilter
            globalFilter={query}
            setGlobalFilter={value => {
              setQuery(value);
              // Reset pagination to the first page when query changes
              setSearchParams(
                prev => {
                  const nextParams = new URLSearchParams(prev);
                  nextParams.set('page', '1');
                  return nextParams;
                },
                { replace: true }
              );
            }}
            tableID="waiver-library-table"
            tableName="waiver-library"
            className="maxw-none tablet:width-mobile-lg tablet:margin-left-1"
            height5
          />
        </Grid>

        <FilterTags
          filters={filterOptions}
          appliedFilters={appliedFilters}
          setAppliedFilters={setAppliedFilters}
        />

        {(query || hasActiveFilters) && (
          <div className="margin-top-3">
            <span>
              <Trans
                i18nKey="waiverLibraryMisc:filters.resultsCount"
                values={{ count: filteredSearchedCommonWaivers.length }}
                components={{
                  bold: <span className="text-bold" />
                }}
              />{' '}
              {query &&
                waiverLibraryMiscT('filters.forSearch', {
                  query
                })}
            </span>
          </div>
        )}
      </div>

      {/* Empty Alert */}
      {(query || hasActiveFilters) && currentItems.length === 0 && (
        <Alert
          type="warning"
          className="margin-bottom-3 padding-y-1 mandatory-fields-alert__text"
          heading={waiverLibraryMiscT('filters.noResults.heading')}
          slim
        >
          <Trans
            i18nKey="waiverLibraryMisc:filters.noResults.content"
            components={{
              email: <Link href="mailto:MINTTeam@cms.hhs.gov"> </Link>
            }}
          />
        </Alert>
      )}

      {/* Waiver Cards */}
      <CardGroup className="padding-x-1">
        <Grid desktop={{ col: 12 }}>
          <Grid row gap={2}>
            {currentItems.map(waiver => (
              <Grid desktop={{ col: 4 }} tablet={{ col: 6 }} key={waiver.id}>
                <WaiverCard waiver={waiver} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </CardGroup>

      {/* Pagination */}
      <div className="display-flex flex-wrap">
        <div key={`pagination-wrapper-page-${currentPage}`}>
          {PaginationComponent}
        </div>

        <TablePageSize
          className="margin-left-auto desktop:grid-col-auto"
          pageSize={itemsPerPage}
          setPageSize={setItemsPerPage}
          valueArray={[3, 6, 9, 12, 15, 'all']}
          suffix={waiverLibraryMiscT('waivers')}
          onChange={() => {
            // Reset pagination to the first page when the page size changes
            setSearchParams(
              prev => {
                const nextParams = new URLSearchParams(prev);
                nextParams.set('page', '1');
                return nextParams;
              },
              { replace: true }
            );
          }}
        />
      </div>
    </>
  );
};

export default WaiverCardGroup;
