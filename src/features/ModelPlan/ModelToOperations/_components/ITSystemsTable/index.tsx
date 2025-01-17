import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { Table } from '@trussworks/react-uswds';
import classNames from 'classnames';

import PageLoading from 'components/PageLoading';
import GlobalClientFilter from 'components/TableFilter';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
import useMessage from 'hooks/useMessage';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';

const ITSystemsTable = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  const { showMessage: setError } = useMessage();

  const possibleNeedsColumns = useMemo(() => {
    return [
      {
        Header: operationalNeedsT<string, {}, string>('name.label'),
        accessor: 'name'
      },
      {
        Header: operationalNeedsT<string, {}, string>('section.label'),
        accessor: 'section',
        Cell: ({
          row,
          value
        }: CellProps<
          GetOperationalNeedsTableType,
          OperationalNeedsSolutionsStatus
        >): string => {
          if (row.original.key && operationalNeedMap[row.original.key]) {
            return i18next.t(
              `${operationalNeedMap[row.original.key].section}:heading`
            );
          }
          return '';
        }
      },

      {
        Header: operationalNeedsT<string, {}, string>('needed.label'),
        accessor: 'status',
        Cell: ({
          row,
          value
        }: CellProps<
          GetOperationalNeedsTableType,
          OperationalNeedsSolutionsStatus
        >): JSX.Element => {
          return <OperationalNeedsStatusTag status={value} />;
        }
      },
      {
        Header: opSolutionsMiscT<string, {}, string>(
          'itSolutionsTable.actions'
        ),
        Cell: ({
          row
        }: CellProps<GetOperationalNeedsTableType>): JSX.Element => {
          return returnActionLinks(row.original.status, row.original, modelID);
        }
      }
    ];
  }, [opSolutionsMiscT, operationalNeedsT, modelID]);

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
      columns: (type === 'needs'
        ? (needsColumns as Column<GetOperationalNeedsTableType>[])
        : (possibleNeedsColumns as Column<GetOperationalNeedsTableType>[])) as Column<object>[],
      data: operationalNeeds,
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
    <div
      className={classNames(className, 'model-plan-table')}
      data-testid={`${type}-table`}
    >
      {!hideGlobalFilter && !isPrintPDF && (
        <>
          <div className="mint-header__basic">
            <GlobalClientFilter
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
              tableID={opSolutionsMiscT('itSolutionsTable.id')}
              tableName={opSolutionsMiscT('itSolutionsTable.title')}
              className="margin-bottom-4 width-mobile-lg maxw-full"
            />
          </div>

          <TableResults
            globalFilter={state.globalFilter}
            pageIndex={state.pageIndex}
            pageSize={state.pageSize}
            filteredRowLength={page.length}
            rowLength={operationalNeeds.length}
            className="margin-bottom-4"
          />
        </>
      )}

      <Table bordered={false} {...getTableProps()} fullWidth scrollable>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={{ ...headerGroup.getHeaderGroupProps() }.key}
            >
              {headerGroup.headers
                .filter(
                  column =>
                    // @ts-ignore
                    !hiddenTableColumns?.includes(column.Header)
                )
                .map((column, index) => (
                  <th
                    {...column.getHeaderProps()}
                    aria-sort={getColumnSortStatus(column)}
                    className="table-header"
                    scope="col"
                    style={{
                      minWidth: index !== 3 ? '138px' : '',
                      paddingBottom: '.5rem',
                      position: 'relative',
                      paddingLeft: index === 0 ? '.5em' : '0px',
                      width:
                        (index === 5 && '235px') ||
                        (index === 2 && '170px') ||
                        (index === 3 && type !== 'possibleNeeds' && '100px') ||
                        'auto'
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
                {row.cells
                  .filter(
                    cell =>
                      // @ts-ignore
                      !hiddenTableColumns?.includes(cell.column.Header)
                  )
                  .map((cell, i) => {
                    if (i === 0) {
                      return (
                        <th
                          {...cell.getCellProps()}
                          scope="row"
                          className={classNames('padding-x-1', {
                            'bg-base-lightest':
                              row.values.status === 'NOT_NEEDED'
                          })}
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
                        className={classNames({
                          'bg-base-lightest': row.values.status === 'NOT_NEEDED'
                        })}
                        style={{
                          paddingLeft: '0',
                          whiteSpace: 'normal',
                          maxWidth: i === 1 ? '275px' : 'auto',
                          borderBottom:
                            index === page.length - 1
                              ? '1px solid black'
                              : 'auto'
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

      {operationalNeeds.length > 10 && (
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

      {operationalNeeds.length === 0 && (
        <Alert
          heading={opSolutionsMiscT('itSolutionsTable.noNeeds')}
          type="info"
        >
          {opSolutionsMiscT('itSolutionsTable.noNeedsInfo')}
        </Alert>
      )}

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
