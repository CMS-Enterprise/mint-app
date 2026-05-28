import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, Row, usePagination, useSortBy, useTable } from 'react-table';
import { Button, Table } from '@trussworks/react-uswds';
import classNames from 'classnames';

import { Alert } from 'components/Alert';
import TablePageSize from 'components/TablePageSize';
import TablePagination from 'components/TablePagination';
import {
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';

import { AdminTab, ContractAssistanceTicket } from '../../constants';

import './index.scss';

export type { ContractAssistanceTicket };

type ContractAssistanceTicketsTableProps = {
  tickets: ContractAssistanceTicket[];
  variant: 'admin' | 'user';
  adminTab?: AdminTab;
};

const ContractAssistanceTicketsTable = ({
  tickets,
  variant,
  adminTab = 'all'
}: ContractAssistanceTicketsTableProps) => {
  const { t } = useTranslation('contractAssistance');
  const isAdmin = variant === 'admin';

  const translationPrefix = isAdmin
    ? `adminActions.emptyState.${adminTab}`
    : 'userSubmittedTickets.emptyState';

  const columns: Column<ContractAssistanceTicket>[] = useMemo(
    () => [
      {
        id: 'ticketId',
        Header: t('table.ticketId'),
        accessor: 'ticketId',
        Cell: ({ row }: { row: Row<ContractAssistanceTicket> }) => (
          <Button
            type="button"
            unstyled
            className="usa-link padding-0"
            onClick={() => {
              // eslint-disable-next-line no-console
              console.log(row.original);
            }}
          >
            {row.original.ticketId}
          </Button>
        )
      },
      {
        id: 'submissionDate',
        Header: t('table.submissionDate'),
        accessor: 'submissionDate'
      },
      {
        id: 'contractName',
        Header: t('table.contractName'),
        accessor: 'contractName',
        Cell: ({ row }: { row: Row<ContractAssistanceTicket> }) =>
          row.original.contractName ? (
            row.original.contractName
          ) : (
            <span className="text-italic">{t('table.noContractName')}</span>
          )
      },
      {
        id: 'helpType',
        Header: t('table.helpType'),
        accessor: 'helpType'
      },
      {
        id: 'status',
        Header: t('table.status'),
        accessor: 'status',
        Cell: ({ row }: { row: Row<ContractAssistanceTicket> }) => (
          <>
            <div>{row.original.status}</div>
            {row.original.assigneeName && (
              <p className="margin-0 text-base-darker font-sans-xs">
                {row.original.assigneeName}
              </p>
            )}
          </>
        )
      }
    ],
    [t]
  );

  const defaultPageSize = isAdmin ? 5 : 10;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state
  } = useTable(
    {
      columns: columns as Column<object>[],
      data: tickets,
      sortTypes: {
        alphanumeric: (rowOne: any, rowTwo: any, columnName: string) => {
          return sortColumnValues(
            rowOne.values[columnName],
            rowTwo.values[columnName]
          );
        }
      },
      autoResetSortBy: false,
      autoResetPage: true,
      initialState: {
        pageIndex: 0,
        pageSize: defaultPageSize
      }
    },
    useSortBy,
    usePagination
  );

  return (
    <div
      className={classNames('contract-assistance-tickets-table-container', {
        'contract-assistance-tickets-table-container--admin': isAdmin
      })}
    >
      <Table
        bordered={false}
        {...getTableProps()}
        className={classNames(
          'contract-assistance-tickets-table margin-top-0 margin-bottom-0',
          {
            'contract-assistance-tickets-table--admin': isAdmin
          }
        )}
        fullWidth
      >
        <caption className="usa-sr-only">
          {t(
            isAdmin
              ? 'adminActions.table.caption'
              : 'userSubmittedTickets.table.caption'
          )}
        </caption>
        <thead className="margin-bottom-2">
          {headerGroups.map(headerGroup => {
            const headerGroupProps = headerGroup.getHeaderGroupProps();

            return (
              <tr
                {...headerGroupProps}
                className="border-bottom-2px"
                key={headerGroupProps.key}
              >
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps()}
                    aria-sort={
                      column.canSort ? getColumnSortStatus(column) : undefined
                    }
                    scope="col"
                    key={column.id}
                    className={classNames(
                      'padding-left-0 padding-y-1 bg-transparent table-header',
                      {
                        'contract-assistance-tickets-table__help-type-column':
                          column.id === 'helpType'
                      }
                    )}
                  >
                    {column.canSort ? (
                      <button
                        className="usa-button usa-button--unstyled position-relative"
                        type="button"
                        {...column.getSortByToggleProps()}
                      >
                        {column.render('Header') as React.ReactNode}
                        {getHeaderSortIcon(column, false)}
                      </button>
                    ) : (
                      column.render('Header')
                    )}
                  </th>
                ))}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {tickets.length === 0 ? (
            <tr>
              <td className="border-0 padding-0" colSpan={columns.length}>
                <Alert
                  type="info"
                  heading={t(`${translationPrefix}.title`)}
                  className="margin-top-2"
                >
                  {t(`${translationPrefix}.copy`)}
                </Alert>
              </td>
            </tr>
          ) : (
            page.map(row => {
              prepareRow(row);
              const { getRowProps, cells, id } = row;

              return (
                <tr {...getRowProps()} key={id}>
                  {cells.map(cell => {
                    const cellProps = cell.getCellProps();

                    return (
                      <td
                        {...cellProps}
                        key={cellProps.key}
                        className={classNames('padding-left-0 bg-transparent', {
                          'contract-assistance-tickets-table__help-type-column':
                            cell.column.id === 'helpType'
                        })}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </Table>

      <div
        className={classNames('grid-row grid-gap grid-gap-lg', {
          'display-flex row-reverse': tickets.length <= state.pageSize
        })}
      >
        {tickets.length > state.pageSize && (
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
            className="desktop:grid-col-fill bg-transparent"
          />
        )}

        <TablePageSize
          className="desktop:grid-col-auto"
          pageSize={state.pageSize}
          setPageSize={setPageSize}
        />
      </div>
    </div>
  );
};

export default ContractAssistanceTicketsTable;
