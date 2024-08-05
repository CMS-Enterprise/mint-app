import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTable } from 'react-table';
import { Table as UswdsTable } from '@trussworks/react-uswds';

import { ExistingProviderSupplierTypes } from 'i18n/en-US/modelPlan/participantsAndProviders';

import tableData from './tableData';

type dataType = {
  providerType: string;
  description: string;
};

function Table({ columns, data }: { columns: any; data: dataType[] }) {
  const { t: modalT } = useTranslation('participantsAndProvidersMisc');
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data
  });

  // Render the UI for your table
  return (
    <UswdsTable
      bordered={false}
      {...getTableProps()}
      fullWidth
      caption={modalT('modal.table.caption')}
    >
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps()}
                className="border-width-2px padding-bottom-1"
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </UswdsTable>
  );
}

const ProviderAndSupplierTable = ({
  type
}: {
  type: ExistingProviderSupplierTypes;
}) => {
  const { t: modalT } = useTranslation('participantsAndProvidersMisc');

  const columns = React.useMemo(
    () => [
      {
        Header:
          type === ExistingProviderSupplierTypes.PROVIDER_TYPES_INSTITUTIONAL
            ? modalT('modal.table.headers.providerType')
            : modalT('modal.table.headers.specialtyCode'),
        accessor: 'providerType'
      },
      {
        Header: modalT('modal.table.headers.description'),
        accessor: 'description'
      }
    ],
    [modalT, type]
  );

  return <Table columns={columns} data={tableData[type]} />;
};

export default ProviderAndSupplierTable;
