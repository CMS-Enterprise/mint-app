import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { CardGroup, Grid } from '@trussworks/react-uswds';
import WaiverInfoPanel from 'features/ModelPlan/AdditionalQuestionnaires/WaiverAssessmentSurvey/_components/WaiverInfoPanel';

import TablePageSize from 'components/TablePageSize';
import usePagination from 'hooks/usePagination';
import useSearchSortPagination from 'hooks/useSearchSortPagination';

import type { CommonWaiverData } from '../..';
import WaiverCard from '../WaiverCard';

const WaiverCardGroup = ({
  commonWaivers
}: {
  commonWaivers: CommonWaiverData[];
}) => {
  const { t: waiverLibraryMiscT } = useTranslation('waiverLibraryMisc');

  const [searchParams, setSearchParams] = useSearchParams();

  const activeWaiverId = searchParams.get('waiverId');

  const { pageSize } = useSearchSortPagination<CommonWaiverData, any>({
    items: commonWaivers,
    filterFunction: useMemo(() => () => [], []),
    sortFunction: (items: CommonWaiverData[], sort: any) => items,
    sortOptions: [
      {
        value: '',
        label: ''
      }
    ],
    defaultItemsPerPage: 6
  });

  const { itemsPerPage, setItemsPerPage } = pageSize;

  const {
    currentItems,
    Pagination: PaginationComponent,
    pagination: { currentPage, pageCount }
  } = usePagination<CommonWaiverData[]>({
    items: commonWaivers,
    itemsPerPage,
    withQueryParams: 'page',
    showPageIfOne: true
  });

  return (
    <>
      {activeWaiverId && <WaiverInfoPanel />}

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
        {currentItems.length > 0 && pageCount > 0 && (
          <div key={`pagination-wrapper-page-${currentPage}`}>
            {PaginationComponent}
          </div>
        )}

        {currentItems.length > 0 && (
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
        )}
      </div>
    </>
  );
};

export default WaiverCardGroup;
