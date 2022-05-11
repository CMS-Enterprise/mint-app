import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import { useQuery } from '@apollo/client';
import { Table as UswdsTable } from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import TablePagination from 'components/TablePagination';
import GetPlanDocumentByModelID from 'queries/GetPlanDocumentByModelID';
import {
  GetModelPlanDocumentByModelID as GetModelPlanDocumentByModelIDType,
  GetModelPlanDocumentByModelID_readPlanDocumentByModelID as PlanDocumentByModelIDType
} from 'queries/types/GetModelPlanDocumentByModelID';
import globalTableFilter from 'utils/globalTableFilter';
import { translateDocumentType } from 'utils/modelPlan';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';

type PlanDocumentsTableProps = {
  hiddenColumns?: string[];
  modelID: string;
};

const PlanDocumentsTable = ({
  hiddenColumns,
  modelID
}: PlanDocumentsTableProps) => {
  const {
    error,
    loading,
    data: documents
  } = useQuery<GetModelPlanDocumentByModelIDType>(GetPlanDocumentByModelID, {
    variables: {
      id: modelID
    }
  });

  const data = (documents?.readPlanDocumentByModelID ??
    []) as PlanDocumentByModelIDType[];

  if (loading) {
    return <PageLoading />;
  }

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  return <Table data={data} hiddenColumns={hiddenColumns} />;
};

export default PlanDocumentsTable;

type TableProps = {
  data: PlanDocumentByModelIDType[];
  hiddenColumns?: string[];
};

const Table = ({ data, hiddenColumns }: TableProps) => {
  const { t } = useTranslation('documents');

  const columns = useMemo(() => {
    return [
      {
        Header: t('documentTable.name'),
        accessor: 'fileName'
      },
      {
        Header: t('documentTable.type'),
        accessor: 'documentType',
        Cell: ({ value }: any) => {
          return translateDocumentType(value);
        }
      },
      {
        Header: t('documentTable.notes'),
        // TODO replace with optional_notes once PR merged
        accessor: 'otherType'
      },
      {
        Header: t('documentTable.uploadDate'),
        accessor: 'createdDts',
        Cell: ({ value }: any) => {
          return DateTime.fromISO(value).toLocaleString(DateTime.DATE_SHORT);
        }
      },
      {
        Header: t('documentTable.actions'),
        accessor: 'id',
        Cell: ({ value }: any) => {
          return 'Virsu scan in progress...';
        }
      }
    ];
  }, [t]);

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
        sortBy: useMemo(() => [{ id: 'modelName', asc: true }], []),
        pageIndex: 0
      }
    },
    useFilters,
    useSortBy,
    usePagination
  );

  if (data.length === 0) {
    return (
      <Alert type="info" heading={t('requestsTable.empty.heading')}>
        {t('requestsTable.empty.body')}
      </Alert>
    );
  }

  return (
    <div className="model-plan-table">
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
                        (index === 2 && '175px') ||
                        '',
                      paddingLeft: '0',
                      paddingBottom: '.5rem',
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
          {page.map((row, index) => {
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
                          style={{
                            paddingLeft: '0',
                            borderBottom:
                              index === page.length - 1 ? 'none' : 'auto'
                          }}
                        >
                          {cell.render('Cell')}
                        </th>
                      );
                    }
                    return (
                      <td
                        {...cell.getCellProps()}
                        style={{
                          paddingLeft: '0',
                          borderBottom:
                            index === page.length - 1 ? 'none' : 'auto'
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
