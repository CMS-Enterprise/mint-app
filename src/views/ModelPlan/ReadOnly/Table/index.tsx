import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Row,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import {
  IconStar,
  IconStarOutline,
  Table as UswdsTable
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import Alert from 'components/shared/Alert';
import GlobalClientFilter from 'components/TableFilter';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
import { GetAllModelPlans_modelPlanCollection as AllModelPlansType } from 'queries/ReadOnly/types/GetAllModelPlans';
import { ModelCategory } from 'types/graphql-global-types';
import { formatDateUtc } from 'utils/date';
import globalFilterCellText from 'utils/globalFilterCellText';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';
import { UpdateFavoriteProps } from 'views/ModelPlan/ModelPlanOverview';
import { RenderFilteredNameHistory } from 'views/ModelPlan/Table';
import formatRecentActivity from 'views/ModelPlan/Table/formatActivity';

type ModelPlansTableProps = {
  data: AllModelPlansType[];
  updateFavorite: (modelPlanID: string, type: UpdateFavoriteProps) => void;
  hiddenColumns?: number[]; // indexes of columns to be hidden
};

const Table = ({
  data,
  updateFavorite,
  hiddenColumns
}: ModelPlansTableProps) => {
  const { t } = useTranslation('readOnlyModelPlan');
  const { t: h } = useTranslation('modelSummary');
  const { t: f } = useTranslation('home');
  const { t: basicsT } = useTranslation('basics');
  const { t: modelPlanT } = useTranslation('modelPlan');

  const columns = useMemo(() => {
    return [
      {
        Header: <IconStarOutline size={3} />,
        accessor: 'isFavorite',
        disableGlobalFilter: true,
        Cell: ({ row }: { row: Row<AllModelPlansType> }) => {
          return row.original.isFavorite ? (
            <button
              onClick={() => updateFavorite(row.original.id, 'removeFavorite')}
              type="button"
              role="checkbox"
              data-testid={`${row.original.modelName}-favorite`}
              className="usa-button usa-button--unstyled display-block"
              aria-label={`Click to unfavorite ${row.original.modelName} model plan`}
              aria-checked="true"
            >
              <IconStar data-cy="favorited" size={3} />
            </button>
          ) : (
            <button
              onClick={() => updateFavorite(row.original.id, 'addFavorite')}
              type="button"
              role="checkbox"
              data-testid={`${row.original.modelName}-unfavorite`}
              className="usa-button usa-button--unstyled display-block"
              aria-label={`Click to favorite ${row.original.modelName} model plan`}
              aria-checked="false"
            >
              <IconStarOutline
                data-cy="unfavorited"
                size={3}
                className="text-gray-30"
              />
            </button>
          );
        }
      },
      {
        Header: f('requestsTable.headers.name'),
        accessor: 'modelName',
        Cell: ({ row, value }: any) => {
          const filteredNameHistory: string[] = row.original.nameHistory?.slice(
            1
          );
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
        Header: f('requestsTable.headers.abbreviation'),
        accessor: 'abbreviation'
      },
      {
        Header: f('requestsTable.headers.amsModelID'),
        accessor: 'basics.amsModelID'
      },
      {
        Header: f('requestsTable.headers.category'),
        accessor: 'basics.modelCategory',
        Cell: ({ row, value }: any) => {
          const additionalModelCategory =
            row.original.basics.additionalModelCategories;

          // Handle no value with an early return
          if (!value) {
            return <div>{h('noAnswer.tBD')}</div>;
          }

          if (additionalModelCategory.length !== 0) {
            const newArray = additionalModelCategory.map(
              (group: ModelCategory) => {
                return basicsT(`modelCategory.options.${group}`);
              }
            );

            return `${basicsT(
              `modelCategory.options.${value}`
            )}, ${newArray.join(', ')}`;
          }
          return basicsT(`modelCategory.options.${value}`);
        }
      },
      {
        Header: f('requestsTable.headers.status'),
        accessor: ({ status }: any) => {
          return modelPlanT(`status.options.${status}`);
        },
        Cell: ({ value }: any) => {
          return value;
        }
      },
      {
        Header: f('requestsTable.headers.clearanceDate'),
        accessor: ({ basics: { clearanceStarts } }: any) => {
          if (clearanceStarts) {
            return formatDateUtc(clearanceStarts, 'MM/dd/yyyy');
          }
          return null;
        },
        Cell: ({ value }: { value: string }) => {
          if (!value) {
            return <div>{f('requestsTable.tbd')}</div>;
          }
          return value;
        }
      },
      {
        Header: f('requestsTable.headers.startDate'),
        accessor: ({ basics: { performancePeriodStarts } }: any) => {
          if (performancePeriodStarts) {
            return formatDateUtc(performancePeriodStarts, 'MM/dd/yyyy');
          }
          return null;
        },
        Cell: ({ value }: any) => {
          if (!value) {
            return <div>{h('noAnswer.tBD')}</div>;
          }
          return value;
        }
      },
      {
        Header: f('requestsTable.headers.recentActivity'),
        accessor: 'modifiedDts',
        Cell: ({ row, value }: any) => {
          const { discussions } = row.original;
          const lastUpdated = value || row.original.createdDts;
          return formatRecentActivity(lastUpdated, discussions);
        }
      }
    ];
  }, [f, updateFavorite, basicsT, h, modelPlanT]);

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
      globalFilter: useMemo(() => globalFilterCellText, []),
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
      <Alert type="info" heading={f('requestsTable.empty.heading')}>
        {f('requestsTable.empty.body')}
      </Alert>
    );
  }

  rows.map(row => prepareRow(row));

  return (
    <div className="model-plan-table">
      <div className="mint-header__basic">
        <GlobalClientFilter
          setGlobalFilter={setGlobalFilter}
          tableID={t('requestsTable.id')}
          tableName={t('requestsTable.title')}
          className="margin-bottom-4 maxw-none grid-col-6"
        />
      </div>

      <TableResults
        globalFilter={state.globalFilter}
        pageIndex={state.pageIndex}
        pageSize={state.pageSize}
        filteredRowLength={page.length}
        rowLength={data.length}
        className="margin-bottom-4"
        showNoResults={false}
      />
      <UswdsTable {...getTableProps()} fullWidth scrollable>
        <caption className="usa-sr-only">{f('requestsTable.caption')}</caption>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers
                // @ts-ignore
                .filter((column, index) => !hiddenColumns?.includes(index))
                .map((column, index) => (
                  <th
                    {...column.getHeaderProps()}
                    aria-sort={getColumnSortStatus(column)}
                    className="table-header"
                    scope="col"
                    style={{
                      minWidth:
                        (index === 0 && '50px') ||
                        (index === 3 && '100px') ||
                        '138px',
                      width:
                        (index === 3 && '150px') ||
                        ((index === 4 || index === 5) && '286px') ||
                        (index === 6 && '175px') ||
                        '',
                      padding: index === 0 ? '0' : 'auto',
                      paddingTop: index === 0 ? '0rem' : 'auto',
                      paddingLeft: '0',
                      paddingBottom: index === 0 ? '0rem' : '.5rem'
                    }}
                  >
                    <button
                      className={classNames('usa-button usa-button--unstyled', {
                        'margin-top-1': index === 0
                      })}
                      type="button"
                      {...column.getSortByToggleProps()}
                    >
                      {column.render('Header')}
                      {getHeaderSortIcon(column, index === 0)}
                    </button>
                  </th>
                ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            return (
              <tr {...row.getRowProps()}>
                {row.cells
                  .filter((cell, index) => {
                    // @ts-ignore
                    return !hiddenColumns?.includes(index);
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
                          borderBottom: 'auto'
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
      {state.globalFilter && page.length === 0 && (
        <Alert
          type="warning"
          aria-live="polite"
          heading={t('allModels.noResults.heading', {
            searchTerm: state.globalFilter
          })}
        >
          {t('allModels.noResults.subheading')}
        </Alert>
      )}

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

export default Table;
