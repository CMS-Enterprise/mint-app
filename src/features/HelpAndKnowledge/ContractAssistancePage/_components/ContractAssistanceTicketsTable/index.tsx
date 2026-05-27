import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, useSortBy, useTable } from 'react-table';
import { Table } from '@trussworks/react-uswds';
import classNames from 'classnames';

import { Alert } from 'components/Alert';
import {
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';

import {
  AdminTab,
  ContractAssistanceTicket,
  TICKET_TABLE_COLUMNS
} from '../../constants';

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
  const { t } = useTranslation('helpAndKnowledge');
  const isAdmin = variant === 'admin';

  const translationPrefix = isAdmin
    ? `contractAssistance.adminActions.emptyState.${adminTab}`
    : 'contractAssistance.userSubmittedTickets.emptyState';

  const columns: Column<ContractAssistanceTicket>[] = useMemo(
    () =>
      TICKET_TABLE_COLUMNS.map(columnKey => ({
        id: columnKey,
        Header: t(`contractAssistance.table.${columnKey}`),
        accessor: columnKey
      })),
    [t]
  );

  const tableOptions = {
    columns: columns as Column<object>[],
    data: tickets,
    ...(variant === 'user' && {
      sortTypes: {
        alphanumeric: (rowOne: any, rowTwo: any, columnName: string) => {
          return sortColumnValues(
            rowOne.values[columnName],
            rowTwo.values[columnName]
          );
        }
      },
      autoResetSortBy: false
    })
  };

  const tablePlugins = variant === 'user' ? [useSortBy] : [];

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(tableOptions, ...tablePlugins);

  return (
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
            ? 'contractAssistance.adminActions.table.caption'
            : 'contractAssistance.userSubmittedTickets.table.caption'
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
                    'padding-left-0 padding-bottom-1 padding-top-1 bg-transparent',
                    {
                      'text-black text-bold ': isAdmin,
                      'table-header': !isAdmin
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
        {rows.length === 0 ? (
          <tr>
            <td
              className="border-0 padding-0 bg-transparent"
              colSpan={columns.length}
            >
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
          rows.map(row => {
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
                      className="padding-left-0"
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
  );
};

export default ContractAssistanceTicketsTable;
