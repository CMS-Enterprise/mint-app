import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
// import { useQuery } from '@apollo/client';
import { Table as UswdsTable } from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import UswdsReactLink from 'components/LinkWrapper';
import Alert from 'components/shared/Alert';
import Spinner from 'components/Spinner';
import GlobalClientFilter from 'components/TableFilter';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
// import GetRequestsQuery from 'queries/GetRequestsQuery';
// import { GetRequests, GetRequestsVariables } from 'queries/types/GetRequests';
// import { RequestType } from 'types/graphql-global-types';
import { formatDate } from 'utils/date';
import globalTableFilter from 'utils/globalTableFilter';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';

// import tableMap from './tableMap';
import data from './mockData';

import './index.scss';

type myRequestsTableProps = {
  // type?: RequestType;
  hiddenColumns?: string[];
};

const Table = ({ hiddenColumns }: myRequestsTableProps) => {
  const { t } = useTranslation('home');
  const loading = false;
  const error = false;

  const columns: any = useMemo(() => {
    return [
      {
        Header: t('requestsTable.headers.name'),
        accessor: 'name',
        Cell: ({ row, value }: any) => {
          return <UswdsReactLink to={row.original.id}>{value}</UswdsReactLink>;
        }
      },
      {
        Header: t('requestsTable.headers.category'),
        accessor: 'category'
      },
      {
        Header: t('requestsTable.headers.modelPoc'),
        accessor: 'modelPoc'
      },
      {
        Header: t('requestsTable.headers.clearanceDate'),
        accessor: 'clearanceDate'
      },
      {
        Header: t('requestsTable.headers.recentActivity'),
        accessor: 'recentActivity'
      }
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Modifying data for table sorting and prepping for Cell configuration
  // const data = useMemo(() => {
  //   if (tableData) {
  //     return tableMap(tableData, t, type);
  //   }
  //   return [];
  // }, [tableData, t, type]);

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
        sortBy: useMemo(() => [{ id: 'name', desc: true }], []),
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
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  if (data.length === 0) {
    return (
      <div className="model-plan-table">
        <Alert type="info" heading={t('requestsTable.empty.heading')}>
          {t('requestsTable.empty.body')}
        </Alert>
      </div>
    );
  }

  return (
    <div className="accessibility-requests-table">
      <GlobalClientFilter
        setGlobalFilter={setGlobalFilter}
        tableID={t('requestsTable.id')}
        tableName={t('requestsTable.title')}
        className="margin-bottom-4"
      />

      <UswdsTable bordered={false} {...getTableProps()} fullWidth scrollable>
        <caption className="usa-sr-only">{t('requestsTable.caption')}</caption>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers
                // @ts-ignore
                .filter(column => !hiddenColumns?.includes(column.Header))
                .map((column, index) => (
                  <th
                    {...column.getHeaderProps()}
                    aria-sort={getColumnSortStatus(column)}
                    className="table-header"
                    scope="col"
                    style={{
                      minWidth: '138px',
                      width:
                        ((index === 0 || index === 1) && '286px') ||
                        (index !== 3 && '200px') ||
                        '',
                      paddingLeft: '0',
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
                {row.cells
                  .filter(cell => {
                    // @ts-ignore
                    return !hiddenColumns?.includes(cell.column.Header);
                  })
                  .map((cell, i) => {
                    if (i === 0) {
                      return (
                        <th
                          {...cell.getCellProps()}
                          scope="row"
                          style={{ paddingLeft: '0', verticalAlign: 'top' }}
                        >
                          {cell.render('Cell')}
                        </th>
                      );
                    }
                    return (
                      <td
                        {...cell.getCellProps()}
                        style={{
                          width: cell.column.width,
                          paddingLeft: '0',
                          verticalAlign: 'top'
                        }}
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
