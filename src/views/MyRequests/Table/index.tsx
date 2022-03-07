import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { useQuery } from '@apollo/client';
import { Table as UswdsTable } from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import UswdsReactLink from 'components/LinkWrapper';
import Spinner from 'components/Spinner';
import GlobalClientFilter from 'components/TableFilter';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
import GetRequestsQuery from 'queries/GetRequestsQuery';
import { GetRequests, GetRequestsVariables } from 'queries/types/GetRequests';
import { formatDate } from 'utils/date';
import globalTableFilter from 'utils/globalTableFilter';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';

import tableMap from './tableMap';

import '../index.scss';

const Table = () => {
  const { t } = useTranslation(['home', 'intake', 'accessibility']);
  const { loading, error, data: tableData } = useQuery<
    GetRequests,
    GetRequestsVariables
  >(GetRequestsQuery, {
    variables: { first: 20 },
    fetchPolicy: 'cache-and-network'
  });

  const columns: any = useMemo(() => {
    return [
      {
        Header: t('requestsTable.headers.name'),
        accessor: 'name',
        Cell: ({ row, value }: any) => {
          let link: string;
          switch (row.original.type) {
            case t('requestsTable.types.ACCESSIBILITY_REQUEST'):
              link = `/508/requests/${row.original.id}`;
              break;
            case t('requestsTable.types.GOVERNANCE_REQUEST'):
              link = `/governance-task-list/${row.original.id}`;
              break;
            default:
              link = '/';
          }
          return <UswdsReactLink to={link}>{value}</UswdsReactLink>;
        },
        width: '220px',
        maxWidth: 350
      },
      {
        Header: t('requestsTable.headers.type'),
        accessor: 'type'
      },
      {
        Header: t('requestsTable.headers.submittedAt'),
        accessor: ({ submittedAt }: any) => {
          if (submittedAt) {
            return DateTime.fromISO(submittedAt);
          }
          return null;
        },
        Cell: ({ value }: any) => {
          if (value) {
            return formatDate(value);
          }
          return 'Not submitted';
        }
      },
      {
        Header: t('requestsTable.headers.status'),
        accessor: 'status',
        Cell: ({ row, value }: any) => {
          switch (row.original.type) {
            case t(`requestsTable.types.ACCESSIBILITY_REQUEST`):
              // Status hasn't changed if the status record created at is the same
              // as the 508 request's submitted at
              if (row.original.submittedAt === row.original.createdAt) {
                return <span>{value}</span>;
              }
              return (
                <span>
                  {value}
                  <span className="text-base-dark font-body-3xs">{` - Changed on ${formatDate(
                    row.original.statusCreatedAt
                  )}`}</span>
                </span>
              );
            case t(`requestsTable.types.GOVERNANCE_REQUEST`):
              if (row.original.lcid) {
                return `${value}: ${row.original.lcid}`;
              }
              return value;
            default:
              return '';
          }
        },
        width: '200px'
      },
      {
        Header: t('requestsTable.headers.nextMeetingDate'),
        accessor: ({ nextMeetingDate }: any) => {
          if (nextMeetingDate) {
            return DateTime.fromISO(nextMeetingDate);
          }
          return null;
        },
        Cell: ({ value }: any) => {
          if (value) {
            return formatDate(value);
          }
          return 'None';
        }
      }
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Modifying data for table sorting and prepping for Cell configuration
  const data = useMemo(() => {
    if (tableData) {
      return tableMap(tableData, t);
    }
    return [];
  }, [tableData, t]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    page,
    setGlobalFilter,
    state,
    prepareRow
  } = useTable(
    {
      columns,
      data,
      sortTypes: {
        alphanumeric: (rowOne, rowTwo, columnName) => {
          return sortColumnValues(
            rowOne.values[columnName],
            rowTwo.values[columnName]
          );
        }
      },
      globalFilter: useMemo(() => globalTableFilter, []),
      autoResetSortBy: false,
      autoResetPage: false,
      initialState: {
        sortBy: useMemo(() => [{ id: 'submittedAt', desc: true }], []),
        pageIndex: 0
      }
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  if (loading) {
    return (
      <div className="text-center" data-testid="table-loading">
        <Spinner size="xl" />;
      </div>
    );
  }

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  if (data.length === 0) {
    return <p>{t('requestsTable.empty')}</p>;
  }

  return (
    <div className="accessibility-requests-table">
      <GlobalClientFilter
        setGlobalFilter={setGlobalFilter}
        tableID={t('requestsTable.id')}
        tableName={t('requestsTable.title')}
        className="margin-bottom-4"
      />

      <TableResults
        globalFilter={state.globalFilter}
        pageIndex={state.pageIndex}
        pageSize={state.pageSize}
        filteredRowLength={page.length}
        rowLength={data.length}
        className="margin-bottom-4"
      />
      <UswdsTable bordered={false} {...getTableProps()} fullWidth scrollable>
        <caption className="usa-sr-only">{t('requestsTable.caption')}</caption>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => (
                <th
                  {...column.getHeaderProps()}
                  aria-sort={getColumnSortStatus(column)}
                  className="table-header"
                  scope="col"
                  style={{
                    minWidth: index === 4 ? '220px' : '140px',
                    width: index === 2 ? '220px' : '140px',
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
                {row.cells.map((cell, i) => {
                  if (i === 0) {
                    return (
                      <th {...cell.getCellProps()} scope="row">
                        {cell.render('Cell')}
                      </th>
                    );
                  }
                  return (
                    <td
                      {...cell.getCellProps()}
                      style={{ width: cell.column.width }}
                    >
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

      <div
        className="usa-sr-only usa-table__announcement-region"
        aria-live="polite"
      >
        {currentTableSortDescription(headerGroups[0])}
      </div>
    </div>
  );
};

export default Table;
