import React, { useMemo } from 'react';
import { Row, useFlexLayout, usePagination, useTable } from 'react-table';
import { CardGroup, Table as UswdsTable } from '@trussworks/react-uswds';
import {
  GetModelsBySolutionQuery,
  OperationalSolutionKey,
  useGetModelsBySolutionQuery
} from 'gql/gen/graphql';

import TablePagination from 'components/TablePagination';

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
  const { data, loading, refetch } = useGetModelsBySolutionQuery({
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
        disableGlobalFilter: true,
        Cell: ({ row }: { row: Row<ModelsBySolutionType[0]> }) => {
          return (
            <CardGroup>
              <ModelSolutionCard
                key={row.original.modelPlan.id}
                modelPlan={row.original.modelPlan}
              />
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
    setPageSize,
    page,
    state,
    prepareRow
  } = useTable(
    {
      columns,
      data: modelsBySolution,
      initialState: {
        pageSize: 3
      }
    },
    usePagination,
    useFlexLayout
  );

  return (
    <div id="models-by-solution-table">
      <UswdsTable {...getTableProps()} fullWidth>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
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
