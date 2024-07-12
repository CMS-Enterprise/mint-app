import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Row,
  useFilters,
  useFlexLayout,
  useGlobalFilter,
  usePagination,
  useTable
} from 'react-table';
import { CardGroup, Grid, Table as UswdsTable } from '@trussworks/react-uswds';
import {
  GetModelsBySolutionQuery,
  OperationalSolutionKey,
  useGetModelsBySolutionQuery
} from 'gql/gen/graphql';

import GlobalClientFilter from 'components/TableFilter';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';

import ModelSolutionCard from '.';

export type ModelsBySolutionType = GetModelsBySolutionQuery['modelPlansByOperationalSolutionKey'];

type ModelPlansTableProps = {
  operationalSolutionKey: OperationalSolutionKey;
};

/**
 * Creating a bare table to house models by solution cards
 * Utilizing pagination if more than three favories
 * Possbility for sort functionality in future
 * */

const ModelsBySolutionTable = ({
  operationalSolutionKey
}: ModelPlansTableProps) => {
  const { t: customHomeT } = useTranslation('customHome');

  const { data, loading } = useGetModelsBySolutionQuery({
    variables: {
      operationalSolutionKey
    }
  });

  const modelsBySolution = useMemo(() => {
    return data?.modelPlansByOperationalSolutionKey || [];
  }, [data?.modelPlansByOperationalSolutionKey]);

  const columns: any = useMemo(() => {
    return [
      {
        accessor: 'id',
        Cell: ({ row }: { row: Row<ModelsBySolutionType[0]> }) => {
          return (
            <CardGroup className="margin-top-2 margin-x-0">
              <Grid desktop={{ col: 4 }} tablet={{ col: 4 }}>
                <ModelSolutionCard
                  key={row.original.modelPlan.id}
                  modelPlan={row.original.modelPlan}
                />
              </Grid>
            </CardGroup>
          );
        }
      }
    ];
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setGlobalFilter,
    setPageSize,
    page,
    state,
    prepareRow
  } = useTable(
    {
      columns,
      data: modelsBySolution,
      globalFilter: useMemo(
        () => (
          rows: Row<any>[],
          columnIds: string[],
          filterValue: string
        ): Row<any>[] => {
          const filterValueLower = filterValue.toLowerCase();
          return rows.filter((row: Row<ModelsBySolutionType[0]>) => {
            // eslint-disable-next-line react/prop-types
            return row?.original?.modelPlan?.modelName // eslint-disable-next-line react/prop-types
              ?.toLowerCase()
              .includes(filterValueLower);
          });
        },
        []
      ),
      initialState: {
        pageSize: 3
      }
    },
    useFlexLayout,
    useFilters,
    useGlobalFilter,
    usePagination
  );

  return (
    <div id="models-by-solution-table">
      <div className="mint-header__basic display-flex flex-justify flex-align-self-start">
        <div>
          <GlobalClientFilter
            setGlobalFilter={setGlobalFilter}
            tableID="models-by-solution-table"
            tableName={customHomeT(
              'settings.MODELS_BY_OPERATIONAL_SOLUTION.heading'
            )}
            className="margin-bottom-3 maxw-none width-mobile-lg"
          />

          <TableResults
            globalFilter={state.globalFilter}
            pageIndex={state.pageIndex}
            pageSize={state.pageSize}
            filteredRowLength={page.length}
            rowLength={modelsBySolution.length}
          />
        </div>
      </div>

      <UswdsTable {...getTableProps()} fullWidth>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              // eslint-disable-next-line react/prop-types
              <tr {...row.getRowProps()}>
                {/* eslint-disable-next-line react/prop-types */}
                {row.cells.map((cell, i) => {
                  return (
                    <td className="border-0 padding-0" {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </UswdsTable>

      {modelsBySolution.length > 3 && (
        <TablePagination
          gotoPage={gotoPage}
          previousPage={previousPage}
          nextPage={nextPage}
          canNextPage={canNextPage}
          pageIndex={state.pageIndex}
          pageOptions={pageOptions}
          canPreviousPage={canPreviousPage}
          pageCount={pageCount}
          pageSize={state.pageSize}
          setPageSize={setPageSize}
          page={[]}
        />
      )}
    </div>
  );
};

export default ModelsBySolutionTable;
