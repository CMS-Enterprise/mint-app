import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { Table as UswdsTable } from '@trussworks/react-uswds';

import GlobalClientFilter from 'components/TableFilter';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
import { ExistingProviderSupplierTypes } from 'i18n/en-US/modelPlan/participantsAndProviders';
import { getHeaderSortIcon } from 'utils/tableSort';

import providerPhysiciansData from './providerPhysiciansData';

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
    gotoPage,
    headerGroups,
    nextPage,
    page,
    pageOptions,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
    state,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // Render the UI for your table
  return (
    <>
      <GlobalClientFilter
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
        tableID={modalT('modal.table.id')}
        tableName={modalT('modal.table.title')}
        className="margin-bottom-4 maxw-none desktop:width-mobile width-full"
      />
      <TableResults
        globalFilter={state.globalFilter}
        pageIndex={state.pageIndex}
        pageSize={state.pageSize}
        filteredRowLength={rows.length}
        rowLength={data.length}
      />
      <UswdsTable bordered={false} {...getTableProps()} fullWidth>
        <caption className="usa-sr-only">
          {modalT('modal.table.caption')}
        </caption>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  className={`border-width-2px padding-bottom-1 ${
                    column.id === 'providerType' ? 'width-card' : ''
                  }`}
                  scope="col"
                >
                  <button
                    className="usa-button usa-button--unstyled position-relative"
                    type="button"
                    {...column.getSortByToggleProps()}
                  >
                    {column.render('Header')}
                    {getHeaderSortIcon(column, false)}
                  </button>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </UswdsTable>
      <TablePagination
        className="flex-justify-start"
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
    </>
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
        Header: modalT(`modal.table.headers.description.${type}`),
        accessor: 'description'
      }
    ],
    [modalT, type]
  );

  return <Table columns={columns} data={providerPhysiciansData[type]} />;
};

export default ProviderAndSupplierTable;
