import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Column,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { Button, Icon, Table } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  MtoRiskIndicator,
  useGetMtoSolutionsAndMilestonesQuery
} from 'gql/generated/graphql';

import PageLoading from 'components/PageLoading';
import GlobalClientFilter from 'components/TableFilter';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
import { EditMTOMilestoneContext } from 'contexts/EditMTOMilestoneContext';
import useMessage from 'hooks/useMessage';
import { formatDateUtc } from 'utils/date';
import globalFilterCellText from 'utils/globalFilterCellText';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';

import MilestoneStatusTag from '../MTOStatusTag';

const ITSystemsTable = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  const { openEditMilestoneModal } = useContext(EditMTOMilestoneContext);

  const { showMessage: setError } = useMessage();

  const { data, loading, error } = useGetMtoSolutionsAndMilestonesQuery({
    variables: { id: modelID }
  });

  const solutions = useMemo(() => {
    if (!data) return [];
    const { mtoMatrix } = data.modelPlan;
    return mtoMatrix.solutions;
  }, [data]);

  console.log(solutions);

  const columns = useMemo<Column<any>[]>(() => {
    return [
      {
        Header: <Icon.Warning size={3} className="left-05 text-base-lighter" />,
        accessor: 'riskIndicator',
        Cell: ({ row }: any) => {
          const { riskIndicator } = row;

          return (
            <span className="text-bold text-base-lighter">
              {(() => {
                if (riskIndicator === MtoRiskIndicator.AT_RISK)
                  return (
                    <Icon.Error className="text-error-dark top-05" size={3} />
                  );
                if (riskIndicator === MtoRiskIndicator.OFF_TRACK)
                  return (
                    <Icon.Warning
                      className="text-warning-dark top-05"
                      size={3}
                    />
                  );
                return '';
              })()}
            </span>
          );
        }
      },
      {
        Header: t<string, {}, string>('table.solution'),
        accessor: 'name'
      },
      {
        Header: t<string, {}, string>('table.relatedMilestones'),
        accessor: 'milestones',
        Cell: ({ row }: any) => {
          if (!row.milestones || row.milestones?.length === 0)
            return t('table.noRelatedMilestones');

          return (
            <>
              {row.milestones[0].name}{' '}
              {row.milestone.length > 1 && (
                <Button
                  type="button"
                  onClick={() => {
                    // TODO: Open edit solution panel
                  }}
                >
                  {t('table.moreMilestones', {
                    count: row.milestones.length - 1
                  })}
                </Button>
              )}
            </>
          );
        }
      },
      {
        Header: t('table.facilitatedBy'),
        accessor: 'facilitatedBy',
        Cell: ({ row }: any) => {
          if (!row.facilitatedBy) return <></>;
          return (
            <>
              {row.facilitatedBy
                .map((facilitator: any) =>
                  t(`facilitatedBy.options.${facilitator}`)
                )
                .join(', ')}
            </>
          );
        }
      },
      {
        Header: t('table.needBy'),
        accessor: 'needBy',
        Cell: ({ row }: any) => {
          if (!row.needBy)
            return <span className="text-italic">{t('table.noneAdded')}</span>;
          return <>{formatDateUtc(row.needBy, 'MM/dd/yyyy')}</>;
        }
      },
      {
        Header: t('table.status'),
        accessor: 'status',
        Cell: ({ row }: any) => {
          const { status } = row;
          if (!status) return <></>;
          return (
            <MilestoneStatusTag status={status} classname="width-fit-content" />
          );
        }
      },
      {
        Header: t<string, {}, string>('table.actions'),
        accessor: 'actions'
      }
    ];
  }, [t]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    setGlobalFilter,
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
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data: solutions,
      sortTypes: {
        alphanumeric: (rowOne, rowTwo, columnName) => {
          return sortColumnValues(
            rowOne.values[columnName],
            rowTwo.values[columnName]
          );
        }
      },
      globalFilter: useMemo(() => globalFilterCellText, []),
      autoResetSortBy: false,
      autoResetPage: true,
      // Remove sort on filterSolutions because its accessor is a function and can't be passed a proper id for initial sort.
      // https://github.com/TanStack/table/issues/2641
      initialState: {
        sortBy: useMemo(() => [{ id: 'name', asc: true }], []),
        pageIndex: 0
      }
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  if (!data && loading) {
    return <PageLoading />;
  }

  // Temp fix for `globalFilterCellText` to work with `page` rows
  // The filter function requires all rows to be prepped so that
  // `Column.Cell` is available during filtering
  rows.map(row => prepareRow(row));

  return (
    <div className={classNames('model-plan-table')}>
      <>
        <div className="mint-header__basic">
          <GlobalClientFilter
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
            tableID={t('itSolutionsTable.id')}
            tableName={t('itSolutionsTable.title')}
            className="margin-bottom-4 width-mobile-lg maxw-full"
          />
        </div>

        <TableResults
          globalFilter={state.globalFilter}
          pageIndex={state.pageIndex}
          pageSize={state.pageSize}
          filteredRowLength={page.length}
          rowLength={solutions.length}
          className="margin-bottom-4"
        />
      </>

      <Table bordered={false} {...getTableProps()} fullWidth scrollable>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={{ ...headerGroup.getHeaderGroupProps() }.key}
            >
              {headerGroup.headers.map((column, index) => (
                <th
                  {...column.getHeaderProps()}
                  aria-sort={getColumnSortStatus(column)}
                  className="table-header"
                  scope="col"
                  style={{
                    paddingBottom: '.5rem',
                    position: 'relative',
                    paddingLeft: index === 0 ? '.5em' : '0px',
                    width: index === 0 ? '60px' : 'auto'
                  }}
                  key={column.id}
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
          {page.map((row, index) => {
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell, i) => {
                  if (i === 0) {
                    return (
                      <th
                        {...cell.getCellProps()}
                        scope="row"
                        className={classNames('padding-x-1')}
                        style={{
                          paddingLeft: '0',
                          borderBottom:
                            index === page.length - 1
                              ? '1px solid black'
                              : 'auto',
                          whiteSpace: 'normal'
                        }}
                        key={cell.getCellProps().key}
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
                        whiteSpace: 'normal',
                        maxWidth: i === 1 ? '275px' : 'auto',
                        borderBottom:
                          index === page.length - 1 ? '1px solid black' : 'auto'
                      }}
                      key={cell.getCellProps().key}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>

      {solutions.length > 10 && (
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
      )}

      <div
        className="usa-sr-only usa-table__announcement-region"
        aria-live="polite"
      >
        {currentTableSortDescription(headerGroups[0])}
      </div>

      {/* {operationalNeeds.length === 0 && (
        <Alert
          heading={opSolutionsMiscT('itSolutionsTable.noNeeds')}
          type="info"
        >
          {opSolutionsMiscT('itSolutionsTable.noNeedsInfo')}
        </Alert>
      )} */}

      {/* {filterSolutions && (
        <FilterViewSolutionsAlert
          filterSolutions={filterSolutions}
          operationalNeeds={operationalNeeds}
        />
      )} */}
    </div>
  );
};

export default ITSystemsTable;
