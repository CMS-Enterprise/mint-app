/**
 * TODO: This component is not complete. It was prototyped as part of
 * https://jiraent.cms.gov/browse/EASI-1367, but has not undergone any 508 testing,
 * UX review, etc.
 */

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Column,
  Row,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { useMutation } from '@apollo/client';
import { Table as UswdsTable } from '@trussworks/react-uswds';

import BookmarkCardIcon from 'components/BookmarkCard/BookmarkCardIcon';
import UswdsReactLink from 'components/LinkWrapper';
import SystemHealthIcon from 'components/SystemHealthIcon';
import GlobalClientFilter from 'components/TableFilter';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices'; // May be temporary if we want to hard code all the CMS acronyms.  For now it creates an acronym for all capitalized words
import DeleteCedarSystemBookmarkQuery from 'queries/DeleteCedarSystemBookmarkQuery';
import { GetCedarSystems_cedarSystems as CedarSystem } from 'queries/types/GetCedarSystems';
import { GetCedarSystemsAndBookmarks_cedarSystemBookmarks as CedarSystemBookmark } from 'queries/types/GetCedarSystemsAndBookmarks';
import { mapCedarStatusToIcon } from 'types/iconStatus';
import {
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';

import './index.scss';

type TableProps = {
  systems: CedarSystem[];
  savedBookmarks: CedarSystemBookmark[];
  refetchBookmarks: () => any;
};

export const Table = ({
  systems,
  savedBookmarks,
  refetchBookmarks
}: TableProps) => {
  const { t } = useTranslation('systemProfile');

  const [deleteMutate] = useMutation(DeleteCedarSystemBookmarkQuery);

  const columns = useMemo<Column<CedarSystem>[]>(() => {
    const bookmarkIdSet: Set<string> = new Set(
      savedBookmarks.map(bm => bm.cedarSystemId)
    );

    return [
      {
        Header: <BookmarkCardIcon size="sm" />,
        accessor: 'id',
        id: 'systemId',
        disableGlobalFilter: true,
        sortType: (rowOne, rowTwo, columnName) => {
          const rowOneElem = rowOne.values[columnName];
          return bookmarkIdSet.has(rowOneElem) ? 1 : -1;
        }
      },
      {
        Header: t<string>('systemTable.header.systemAcronym'),
        accessor: 'acronym',
        disableGlobalFilter: true
      },
      {
        Header: t<string>('systemTable.header.systemName'),
        accessor: 'name',
        id: 'systemName',
        Cell: ({ row }: { row: Row<CedarSystem> }) => (
          <UswdsReactLink to={`/systems/${row.original.id}/home/top`}>
            {row.original.name}
          </UswdsReactLink>
        )
      },
      {
        Header: t<string>('systemTable.header.systemOwner'),
        accessor: 'businessOwnerOrg',
        id: 'systemOwner',
        disableGlobalFilter: true,
        Cell: ({ row }: { row: Row<CedarSystem> }) => (
          <p>
            {cmsDivisionsAndOffices.find(
              item => item.name === row.original.businessOwnerOrg
            )?.acronym || row.original.businessOwnerOrg}
          </p>
        )
      },
      {
        Header: t<string>('systemTable.header.systemStatus'),
        accessor: 'status',
        id: 'systemStatus',
        disableGlobalFilter: true,
        Cell: ({ row }: { row: Row<CedarSystem> }) => (
          <div>
            <SystemHealthIcon
              status={mapCedarStatusToIcon(row.original.status)}
              size="medium"
              className="margin-right-1"
            />
            <span>{row.original.status}</span>
          </div>
        )
      }
    ];
  }, "[t, savedBookmarks, deleteMutate, refetchBookmarks]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    setGlobalFilter,
    state,
    rows,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      sortTypes: {
        alphanumeric: (rowOne, rowTwo, columnName) => {
          return sortColumnValues(
            rowOne.values[columnName],
            rowTwo.values[columnName]
          );
        }
      },
      columns,
      data: systems as CedarSystem[],
      autoResetSortBy: false,
      autoResetPage: false,
      initialState: {
        sortBy: useMemo(() => [{ id: 'systemName', desc: false }], []),
        pageIndex: 0
      }
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <>
      <GlobalClientFilter
        setGlobalFilter={setGlobalFilter}
        tableID={t('systemTable.id')}
        tableName={t('systemTable.title')}
        className="margin-bottom-4"
      />

      <TableResults
        globalFilter={state.globalFilter}
        pageIndex={pageIndex}
        pageSize={pageSize}
        filteredRowLength={rows.length}
        rowLength={systems.length}
        className="margin-bottom-4"
      />

      <UswdsTable bordered={false} fullWidth scrollable {...getTableProps()}>
        <caption className="usa-sr-only">{t('systemTable.caption')}</caption>

        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  aria-sort={getColumnSortStatus(column)}
                  scope="col"
                  style={{
                    minWidth: index === 0 ? '50px' : '150px',
                    padding: index === 0 ? '0' : 'auto',
                    paddingLeft: index === 0 ? '.5em' : 'auto',
                    position: 'relative'
                  }}
                >
                  <button
                    className="usa-button usa-button--unstyled"
                    type="button"
                    {...column.getSortByToggleProps()}
                  >
                    {column.render('Header')}
                    {getHeaderSortIcon(column)}
                  </button>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, index) => (
                  <th
                    style={{
                      paddingLeft: index === 0 ? '.5em' : 'auto'
                    }}
                    {...cell.getCellProps()}
                  >
                    {cell.render('Cell')}
                  </th>
                ))}
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
        pageIndex={pageIndex}
        pageOptions={pageOptions}
        canPreviousPage={canPreviousPage}
        pageCount={pageCount}
        pageSize={pageSize}
        setPageSize={setPageSize}
        page={[]}
      />
    </>
  );
};

export default Table;
