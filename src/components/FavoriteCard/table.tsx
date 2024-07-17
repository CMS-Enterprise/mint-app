import React, { useMemo } from 'react';
import { Row, useFlexLayout, usePagination, useTable } from 'react-table';
import { CardGroup, Table as UswdsTable } from '@trussworks/react-uswds';
import { GetFavoritesQuery } from 'gql/gen/graphql';

import TablePagination from 'components/TablePagination';
import { UpdateFavoriteProps } from 'views/ModelPlan/ModelPlanOverview';

import FavoriteCard from '.';

type FavoritesModelType = GetFavoritesQuery['modelPlanCollection'][0];

type ModelPlansTableProps = {
  favorites: FavoritesModelType[];
  removeFavorite: (modelPlanID: string, type: UpdateFavoriteProps) => void;
  toTaskList?: boolean;
};

/**
 * Creating a bare table to house favorite cards
 * Utilizing pagination if more than three favories
 * Possbility for sort functionality in future
 * */

const FavoritesTable = ({
  favorites,
  removeFavorite,
  toTaskList = false
}: ModelPlansTableProps) => {
  const columns: any = useMemo(() => {
    return [
      {
        accessor: 'id',
        disableGlobalFilter: true,
        Cell: ({ row }: { row: Row<FavoritesModelType> }) => {
          return (
            <CardGroup>
              <FavoriteCard
                key={row.original.id}
                modelPlan={row.original}
                removeFavorite={removeFavorite}
                toTaskList={toTaskList}
              />
            </CardGroup>
          );
        }
      }
    ];
  }, [removeFavorite, toTaskList]);

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

      {favorites.length > 3 && (
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

export default FavoritesTable;
