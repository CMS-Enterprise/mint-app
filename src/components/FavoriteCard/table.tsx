import React, { useMemo } from 'react';
import { Row, useFlexLayout, usePagination, useTable } from 'react-table';
import { CardGroup, Table as UswdsTable } from '@trussworks/react-uswds';

import TablePagination from 'components/TablePagination';
import { GetAllModelPlans_modelPlanCollection as AllModelPlansType } from 'queries/ReadOnly/types/GetAllModelPlans';
import { UpdateFavoriteProps } from 'views/ModelPlan/ModelPlanOverview';

import FavoriteCard from '.';

type ModelPlansTableProps = {
  favorites: AllModelPlansType[];
  removeFavorite: (modelPlanID: string, type: UpdateFavoriteProps) => void;
};

const FavoritesTable = ({
  favorites,
  removeFavorite
}: ModelPlansTableProps) => {
  const columns: any = useMemo(() => {
    return [
      {
        accessor: 'id',
        disableGlobalFilter: true,
        Cell: ({ row }: { row: Row<AllModelPlansType> }) => {
          return (
            <CardGroup className="margin-bottom-3">
              <FavoriteCard
                key={row.original.id}
                modelPlan={row.original}
                removeFavorite={removeFavorite}
              />
            </CardGroup>
          );
        }
      }
    ];
  }, [removeFavorite]);

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
      data: favorites,
      initialState: {
        pageSize: 3
      }
    },
    usePagination,
    useFlexLayout
  );

  return (
    <div id="favorite-table">
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
    </div>
  );
};

export default FavoritesTable;
