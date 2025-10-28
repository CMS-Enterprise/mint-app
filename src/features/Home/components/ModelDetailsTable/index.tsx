import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Column,
  Row,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { Button, Icon, Table as UswdsTable } from '@trussworks/react-uswds';
import { ModelCategory } from 'gql/generated/graphql';
import i18next from 'i18next';

import UswdsReactLink from 'components/LinkWrapper';
import GlobalClientFilter from 'components/TableFilter';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
import TopScrollContainer from 'components/TopScrollContainer';
import { formatDateLocal, formatDateUtc } from 'utils/date';
import globalFilterCellText from 'utils/globalFilterCellText';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';

import { ModelPlansType } from '../ModelsByStatusGroup';

import './index.scss';

const ModelDetailsTable = ({
  models,
  hiddenColumns,
  canSearch = true
}: {
  models: ModelPlansType[];
  hiddenColumns?: string[]; // ids of columns to be hidden
  canSearch?: boolean;
}) => {
  const { t: homeT } = useTranslation('customHome');
  const skipPageResetRef = useRef<boolean>(false);

  const columns: Column<ModelPlansType>[] = useMemo(
    () => [
      {
        id: 'modelName',
        Header: homeT('requestsTable.headers.name'),
        accessor: 'modelName',
        Cell: ({ row, value }: { row: Row<ModelPlansType>; value: string }) => {
          const filteredNameHistory: string[] =
            row.original.nameHistory?.slice(1);
          return (
            <>
              <UswdsReactLink
                to={`/models/${row.original.id}/read-only/model-basics`}
              >
                {value}
              </UswdsReactLink>
              {filteredNameHistory && filteredNameHistory.length > 0 && (
                <RenderFilteredNameHistory names={filteredNameHistory} />
              )}
            </>
          );
        }
      },
      {
        id: 'abbreviation',
        Header: homeT('requestsTable.headers.abbreviation'),
        accessor: 'abbreviation'
      },
      {
        id: 'amsModelID',
        Header: homeT('requestsTable.headers.amsModelID'),
        accessor: row => row.basics.amsModelID
      },
      {
        id: 'modelCategory',
        Header: homeT('requestsTable.headers.category'),
        accessor: row => row.basics.modelCategory,
        Cell: ({ row, value }: { row: Row<ModelPlansType>; value: string }) => {
          const additionalModelCategory =
            row.original.basics.additionalModelCategories;

          // Handle no value with an early return
          if (!value) {
            return <div>{homeT('requestsTable.tbd')}</div>;
          }

          if (additionalModelCategory.length !== 0) {
            const newArray = additionalModelCategory.map(
              (group: ModelCategory) => {
                return i18next.t(
                  `basics:additionalModelCategories.options.${group}`
                );
              }
            );

            return `${i18next.t(
              `basics:modelCategory.options.${value}`
            )}, ${newArray.join(', ')}`;
          }
          return i18next.t(
            `basics:modelCategory.options.${value}`
          ) as typeof value;
        }
      },
      {
        id: 'status',
        Header: homeT('requestsTable.headers.status'),
        accessor: ({ status }) => {
          return i18next.t(`modelPlan:status.options.${status}`);
        }
      },
      {
        id: 'clearanceDate',
        Header: homeT('requestsTable.headers.clearanceDate'),
        accessor: ({ timeline: { clearanceStarts } }) => {
          if (clearanceStarts) {
            return formatDateUtc(clearanceStarts, 'MM/dd/yyyy');
          }
          return null;
        },
        Cell: ({ value }: { value: string }) => {
          if (!value) {
            return <div>{homeT('requestsTable.tbd')}</div>;
          }
          return value;
        }
      },
      {
        id: 'startDate',
        Header: homeT('requestsTable.headers.startDate'),
        accessor: ({ timeline: { performancePeriodStarts } }) => {
          if (performancePeriodStarts) {
            return formatDateUtc(performancePeriodStarts, 'MM/dd/yyyy');
          }
          return null;
        },
        Cell: ({ value }: { value: string }) => {
          if (!value) {
            return <div>{homeT('requestsTable.tbd')}</div>;
          }
          return value;
        }
      },
      // TODO: End date column
      // {
      //   id: 'endDate',
      //   Header: homeT('requestsTable.headers.endDate'),
      //   accessor: ({ timeline: { performancePeriodEnds } }) => {
      //     if (performancePeriodEnds) {
      //       return formatDateUtc(performancePeriodEnds, 'MM/dd/yyyy');
      //     }
      //     return null;
      //   },
      //   Cell: ({ value }: { value: string }) => {
      //     if (!value) {
      //       return <div>{homeT('requestsTable.tbd')}</div>;
      //     }
      //     return value;
      //   }
      // },
      {
        id: 'paymentDate',
        Header: homeT('requestsTable.headers.paymentDate'),
        accessor: row => {
          if (row.payments?.paymentStartDate) {
            return formatDateUtc(row.payments.paymentStartDate, 'MM/dd/yyyy');
          }
          return null;
        },
        Cell: ({ value }: { value: string }) => {
          if (!value) {
            return <div>{homeT('requestsTable.tbd')}</div>;
          }
          return value;
        }
      },
      {
        id: 'mostRecentEdit',
        Header: homeT('requestsTable.headers.recentActivity'),
        accessor: row => row.mostRecentEdit?.date || row.createdDts,
        Cell: ({ row, value }: { row: Row<ModelPlansType>; value: string }) => {
          const { discussions } = row.original;
          const formattedUpdatedDate = `${homeT(
            'requestsTable.updated'
          )} ${formatDateLocal(value, 'MM/dd/yyyy')}`;
          return (
            <>
              {formattedUpdatedDate}
              {discussions.length > 0 && (
                <div
                  className="display-flex flex-align-center text-bold"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <Icon.Comment
                    className="text-primary margin-right-05"
                    aria-label="comment"
                  />{' '}
                  {discussions.length}{' '}
                  {i18next.t('discussionsMisc:discussionBanner.discussion', {
                    count: discussions.length
                  })}
                </div>
              )}
            </>
          );
        }
      }
    ],
    [homeT]
  );

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
    rows,
    prepareRow
  } = useTable(
    {
      columns: columns as Column<object>[],
      data: models,
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
      // https://react-table-v7-docs.netlify.app/docs/faq#how-do-i-stop-my-table-state-from-automatically-resetting-when-my-data-changes
      // Resets to page 1 if set to true
      // skipPageResetRef's default state is false
      // When user favorites/unfavorites a model plan, the skipPageResetRef is set to true and therefore the page does not reset
      // when user search the table, skipPageResetRef is set to false and therefore the page resets
      autoResetPage: !skipPageResetRef.current,
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

  rows.map(row => prepareRow(row));

  const homeStyle = (index: number) => {
    return {
      minWidth:
        (index === 0 && '170px') ||
        (index === 2 && '100px') ||
        (index === 1 && '110px') ||
        '138px',
      paddingLeft: '0'
    };
  };

  return (
    <div
      className="model-plan-table"
      data-testid="models-by-status-table-wrapper"
    >
      <div className="mint-header__basic display-flex flex-justify flex-align-self-start">
        <div>
          {canSearch && (
            <div>
              <GlobalClientFilter
                skipPageResetRef={skipPageResetRef}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
                tableID={homeT('requestsTable.id')}
                tableName={homeT('requestsTable.title')}
                className="margin-bottom-4 maxw-none width-mobile-lg"
              />

              <TableResults
                globalFilter={state.globalFilter}
                pageIndex={state.pageIndex}
                pageSize={state.pageSize}
                filteredRowLength={page.length}
                rowLength={models.length}
              />
            </div>
          )}
        </div>
      </div>

      <TopScrollContainer>
        <UswdsTable {...getTableProps()} fullWidth>
          <caption className="usa-sr-only">
            {homeT('requestsTable.caption')}
          </caption>

          <thead>
            {headerGroups.map(headerGroup => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                key={{ ...headerGroup.getHeaderGroupProps() }.key}
              >
                {headerGroup.headers
                  .filter(column => !hiddenColumns?.includes(column.id))
                  .map((column, index) => (
                    <th
                      {...column.getHeaderProps()}
                      aria-sort={getColumnSortStatus(column)}
                      className="table-header"
                      scope="col"
                      style={homeStyle(index)}
                      key={column.id}
                    >
                      <button
                        className="usa-button usa-button--unstyled position-relative"
                        type="button"
                        {...column.getSortByToggleProps()}
                      >
                        {column.render('Header') as React.ReactElement}
                        {getHeaderSortIcon(column, index === 0)}
                      </button>
                    </th>
                  ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              // need to destructure row and getRowProps to avoid TS error for prop-types
              const { getRowProps, cells } = { ...row };

              return (
                <tr {...getRowProps()} key={row.id}>
                  {cells
                    .filter(cell => {
                      return !hiddenColumns?.includes(cell.column.id);
                    })
                    .map((cell, i) => {
                      if (i === 0) {
                        return (
                          <th
                            {...cell.getCellProps()}
                            scope="row"
                            style={{
                              paddingLeft: '0',
                              borderBottom: 'auto'
                            }}
                            key={cell.getCellProps().key}
                          >
                            {cell.render('Cell') as React.ReactElement}
                          </th>
                        );
                      }
                      return (
                        <td
                          {...cell.getCellProps()}
                          style={{
                            paddingLeft: '0',
                            borderBottom: 'auto',
                            whiteSpace: 'normal'
                          }}
                          key={cell.getCellProps().key}
                        >
                          {cell.render('Cell') as React.ReactElement}
                        </td>
                      );
                    })}
                </tr>
              );
            })}
          </tbody>
        </UswdsTable>
      </TopScrollContainer>

      {canSearch && models.length > 10 && (
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
    </div>
  );
};

const RenderFilteredNameHistory = ({ names }: { names: string[] }) => {
  const { t } = useTranslation('customHome');
  const [isShowingAllNames, setShowAllNames] = useState(false);

  const firstThreeNames = names.slice(0, 3);

  return (
    <>
      <p className="margin-y-0 font-body-xs line-height-sans-2">
        {t('previously')}{' '}
        {isShowingAllNames
          ? `${names.join(', ')}`
          : `${firstThreeNames.join(', ')}`}
      </p>
      {names.length > 3 && (
        <Button
          unstyled
          type="button"
          className="margin-top-1 font-body-xs"
          onClick={() => {
            setShowAllNames(!isShowingAllNames);
          }}
        >
          {isShowingAllNames
            ? t('viewLess')
            : t('viewMore', { number: `${names.length - 3}` })}
        </Button>
      )}
    </>
  );
};

export default ModelDetailsTable;
