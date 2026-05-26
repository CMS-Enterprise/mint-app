import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, useTable } from 'react-table';
import { Table as UswdsTable } from '@trussworks/react-uswds';

import { Alert } from 'components/Alert';

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
};

const ContractAssistanceTicketsTable = ({
  tickets
}: ContractAssistanceTicketsTableProps) => {
  const { t } = useTranslation('helpAndKnowledge');

  const columns: Column<ContractAssistanceTicket>[] = useMemo(
    () => [
      {
        id: 'ticketId',
        Header: t('contractAssistance.adminActions.table.ticketId'),
        accessor: 'ticketId'
      },
      {
        id: 'submissionDate',
        Header: t('contractAssistance.adminActions.table.submissionDate'),
        accessor: 'submissionDate'
      },
      {
        id: 'contractName',
        Header: t('contractAssistance.adminActions.table.contractName'),
        accessor: 'contractName'
      },
      {
        id: 'helpType',
        Header: t('contractAssistance.adminActions.table.helpType'),
        accessor: 'helpType'
      },
      {
        id: 'status',
        Header: t('contractAssistance.adminActions.table.status'),
        accessor: 'status'
      }
    ],
    [t]
  );

  const { getTableProps, getTableBodyProps, rows, prepareRow } = useTable({
    columns: columns as Column<object>[],
    data: tickets
  });

  return (
    <UswdsTable
      bordered={false}
      {...getTableProps()}
      className="margin-top-0 margin-bottom-0"
      fullWidth
    >
      <caption className="usa-sr-only">
        {t('contractAssistance.adminActions.table.caption')}
      </caption>
      <thead className="margin-bottom-2">
        <tr className=" border-bottom-2px">
          {columns.map(column => (
            <th
              scope="col"
              key={column.id}
              className="padding-left-0 padding-bottom-1 padding-top-1 text-black bg-primary-lighter text-bold"
            >
              {column.Header as string}
            </th>
          ))}
        </tr>
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.length === 0 ? (
          <tr>
            <td
              className="border-0 padding-0 bg-primary-lighter"
              colSpan={columns.length}
            >
              <Alert
                type="info"
                heading={t('contractAssistance.adminActions.emptyState.title')}
                className="margin-top-2"
              >
                {t('contractAssistance.adminActions.emptyState.copy')}
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
    </UswdsTable>
  );
};

export default ContractAssistanceTicketsTable;
