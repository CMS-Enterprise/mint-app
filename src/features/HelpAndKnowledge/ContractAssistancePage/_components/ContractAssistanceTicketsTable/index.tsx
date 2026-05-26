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

import './index.scss';

export type ContractAssistanceTicket = {
  ticketId: string;
  submissionDate: string;
  contractName: string;
  helpType: string;
  status: string;
};

type ContractAssistanceTicketsTableProps = {
  tickets: ContractAssistanceTicket[];
  isAdmin: boolean;
};

const ContractAssistanceTicketsTable = ({
  tickets,
  isAdmin
}: ContractAssistanceTicketsTableProps) => {
  const { t } = useTranslation('helpAndKnowledge');

  const translationPrefix = isAdmin
    ? 'contractAssistance.adminActions'
    : 'contractAssistance.userSubmittedTickets';

  const columns: Column<ContractAssistanceTicket>[] = useMemo(
    () => [
      {
        id: 'ticketId',
        Header: t('contractAssistance.adminActions.table.ticketId'),
        accessor: 'ticketId',
        disableSortBy: isAdmin
      },
      {
        id: 'submissionDate',
        Header: t('contractAssistance.adminActions.table.submissionDate'),
        accessor: 'submissionDate',
        disableSortBy: isAdmin
      },
      {
        id: 'contractName',
        Header: t('contractAssistance.adminActions.table.contractName'),
        accessor: 'contractName',
        disableSortBy: isAdmin
      },
      {
        id: 'helpType',
        Header: t('contractAssistance.adminActions.table.helpType'),
        accessor: 'helpType',
        disableSortBy: isAdmin
      },
      {
        id: 'status',
        Header: t('contractAssistance.adminActions.table.status'),
        accessor: 'status',
        disableSortBy: isAdmin
      }
    ],
    [t, isAdmin]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns: columns as Column<object>[],
        data: tickets,
        sortTypes: {
          alphanumeric: (rowOne, rowTwo, columnName) => {
            return sortColumnValues(
              rowOne.values[columnName],
              rowTwo.values[columnName]
            );
          }
        },
        autoResetSortBy: false
      },
      useSortBy
    );

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
        {t(`${translationPrefix}.table.caption`)}
      </caption>
      <thead className="margin-bottom-2">
        {headerGroups.map(headerGroup => (
          <tr
            {...headerGroup.getHeaderGroupProps()}
            className="border-bottom-2px"
            key={{ ...headerGroup.getHeaderGroupProps() }.key}
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
                  'padding-left-0 padding-bottom-1 padding-top-1',
                  {
                    'text-black bg-primary-lighter text-bold': isAdmin,
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
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.length === 0 ? (
          <tr>
            <td
              className={classNames('border-0 padding-0', {
                'bg-primary-lighter': isAdmin
              })}
              colSpan={columns.length}
            >
              <Alert
                type="info"
                heading={t(`${translationPrefix}.emptyState.title`)}
                className="margin-top-2"
              >
                {t(`${translationPrefix}.emptyState.copy`)}
              </Alert>
            </td>
          </tr>
        ) : (
          rows.map(row => {
            prepareRow(row);
            const { getRowProps, cells, id } = row;

            return (
              <tr {...getRowProps()} key={id}>
                {cells.map(cell => (
                  <td
                    {...cell.getCellProps()}
                    key={cell.getCellProps().key}
                    className="padding-left-0"
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })
        )}
      </tbody>
    </Table>
  );
};

export default ContractAssistanceTicketsTable;
