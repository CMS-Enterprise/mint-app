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
import Alert from 'components/shared/Alert';
import GlobalClientFilter from 'components/TableFilter';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
import GetDraftModelPlans from 'queries/GetModelPlans';
import { GetModelCollaborators_modelPlan_collaborators as CollaboratorsType } from 'queries/types/GetModelCollaborators';
import {
  GetModelPlans as GetDraftModelPlansType,
  GetModelPlans_modelPlanCollection as DraftModelPlanType
} from 'queries/types/GetModelPlans';
import globalTableFilter from 'utils/globalTableFilter';
import { translateModelPlanStatus } from 'utils/modelPlan';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';

import formatRecentActivity from './formatActivity';

import './index.scss';

type TableProps = {
  data: DraftModelPlanType[];
  hiddenColumns?: string[];
};

const Table = ({ data, hiddenColumns }: TableProps) => {
  const { t } = useTranslation('home');

  const columns = useMemo(() => {
    return [
      {
        Header: t('requestsTable.headers.name'),
        accessor: 'modelName',
        Cell: ({ row, value }: any) => {
          return (
            <UswdsReactLink to={`/models/${row.original.id}/task-list`}>
              {value}
            </UswdsReactLink>
          );
        }
      },
      {
        Header: t('requestsTable.headers.modelPoc'),
        accessor: 'collaborators',
        Cell: ({ value }: any) => {
          if (value) {
            const leads = value.filter((item: CollaboratorsType) => {
              return item.teamRole.toLowerCase().includes('model_lead');
            });
            return (
              <>
                {leads.map((item: CollaboratorsType, index: number) => {
                  return `${item.fullName}${
                    index === leads.length - 1 ? '' : ', '
                  }`;
                })}
              </>
            );
          }
          return '';
        }
      },
      {
        Header: t('requestsTable.headers.clearanceDate'),
        accessor: 'clearanceDate',
        Cell: ({ value }: any) => {
          if (!value) {
            return <div>{t('requestsTable.tbd')}</div>;
          }
          return value;
        }
      },
      {
        Header: t('requestsTable.headers.status'),
        accessor: 'status',
        Cell: ({ value }: any) => {
          return translateModelPlanStatus(value);
        }
      },
      {
        Header: t('requestsTable.headers.recentActivity'),
        accessor: 'modifiedDts',
        Cell: ({ row, value }: any) => {
          const { discussions } = row.original;
          return formatRecentActivity(value, discussions);
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
        sortBy: useMemo(() => [{ id: 'modelName', asc: true }], []),
        pageIndex: 0
      }
    },
    useFilters,
    useGlobalFilter,
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

type DraftModelTableProps = {
  hiddenColumns?: string[];
};

const DraftModelPlansTable = ({ hiddenColumns }: DraftModelTableProps) => {
  const { error, data: modelPlans } = useQuery<GetDraftModelPlansType>(
    GetDraftModelPlans
  );

  const data = (modelPlans?.modelPlanCollection ?? []) as DraftModelPlanType[];

  // TODO: Remove mocked discussion data once discussion story complete
  const discussions = [
    {
      content: 'Content 1',
      replies: [
        {
          content: 'Reply 1'
        }
      ]
    },
    {
      content: 'Content 2',
      replies: []
    },
    {
      content: 'Content 2',
      replies: []
    }
  ];

  // Mocking discussion data for only first row
  const mockedData = data.map((item, index) => {
    if (index === 0) {
      return { ...item, discussions };
    }
    return { ...item };
  });

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  return <Table data={mockedData} hiddenColumns={hiddenColumns} />;
};

export default DraftModelPlansTable;
