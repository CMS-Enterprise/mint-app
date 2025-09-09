import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Column,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { Button, Icon, Table as UswdsTable } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { downloadMTOMilestoneSummary } from 'features/Analytics/util';
import { UpdateFavoriteProps } from 'features/ModelPlan/ModelPlanOverview';
import {
  GetEchimpCrandTdlQuery,
  GetModelPlansQuery,
  GetMtoMilestoneSummaryQuery,
  KeyCharacteristic,
  ModelCategory,
  ModelPlanFilter,
  TeamRole,
  useGetModelPlansQuery,
  useGetMtoMilestoneSummaryQuery,
  ViewCustomizationType
} from 'gql/generated/graphql';
import i18next from 'i18next';

import Alert from 'components/Alert';
import CsvExportLink from 'components/CSVExportLink/CsvExportLink';
import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
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

import './index.scss';

type AllModelPlansType = GetModelPlansQuery['modelPlanCollection'][0];
type CollaboratorsType =
  GetModelPlansQuery['modelPlanCollection'][0]['collaborators'][0];
type EchimpCrAndTdlsType =
  GetEchimpCrandTdlQuery['modelPlan']['echimpCRsAndTDLs'][0];

type HomeTableTypes =
  | ViewCustomizationType.ALL_MODEL_PLANS
  | ViewCustomizationType.MODELS_WITH_CR_TDL
  | ViewCustomizationType.MY_MODEL_PLANS
  | ViewCustomizationType.FOLLOWED_MODELS;

type ModelPlansTableProps = {
  id: string;
  type: HomeTableTypes;
  updateFavorite?: (modelPlanID: string, type: UpdateFavoriteProps) => void;
  hiddenColumns?: number[]; // indexes of columns to be hidden
  canSearch?: boolean;
  isHome?: boolean;
  isAssessment?: boolean;
};

const ModelPlansTable = ({
  id,
  type,
  updateFavorite,
  hiddenColumns,
  canSearch = true,
  isHome = true,
  isAssessment
}: ModelPlansTableProps) => {
  const { t: homeT } = useTranslation('customHome');
  const skipPageResetRef = useRef<boolean>(false);

  let queryType = ModelPlanFilter.COLLAB_ONLY;

  if (type === ViewCustomizationType.ALL_MODEL_PLANS) {
    queryType = ModelPlanFilter.INCLUDE_ALL;
  } else if (type === ViewCustomizationType.MODELS_WITH_CR_TDL) {
    queryType = ModelPlanFilter.WITH_CR_TDLS;
  }

  const {
    data: modelPlans,
    loading,
    error
  } = useGetModelPlansQuery({
    variables: {
      filter: queryType,
      isMAC: type === ViewCustomizationType.MODELS_WITH_CR_TDL
    }
  });

  const data = useMemo(() => {
    return (modelPlans?.modelPlanCollection ?? []) as AllModelPlansType[];
  }, [modelPlans?.modelPlanCollection]);

  const { data: mtoMilestoneSummary } = useGetMtoMilestoneSummaryQuery();

  const mtoMilestoneSummaryData = useMemo(() => {
    return (
      mtoMilestoneSummary?.modelPlanCollection ??
      ([] as GetMtoMilestoneSummaryQuery['modelPlanCollection'])
    );
  }, [mtoMilestoneSummary?.modelPlanCollection]);

  const columns = useMemo<Column<any>[]>(() => {
    const homeColumns: string[] = [
      'modelName',
      'abbreviation',
      'amsModelID',
      'demoCode',
      'modelCategory',
      'status',
      'clearanceDate',
      'startDate',
      'mostRecentEdit'
    ];

    const tableColumns: Record<HomeTableTypes, string[]> = {
      [ViewCustomizationType.MY_MODEL_PLANS]: [...homeColumns],
      [ViewCustomizationType.ALL_MODEL_PLANS]: [
        ...(!isHome ? ['isFavorite'] : []),
        ...homeColumns
      ],
      [ViewCustomizationType.FOLLOWED_MODELS]: ['isFavorite', ...homeColumns],
      [ViewCustomizationType.MODELS_WITH_CR_TDL]: [
        'modelName',
        'status',
        'startDate',
        'paymentDate',
        'keyCharacteristics',
        'demoCode',
        'crTdls',
        'modelPoc'
      ]
    };

    const columnOptions: Record<string, Column> = {
      isFavorite: {
        id: 'isFavorite',
        Header: <Icon.StarOutline size={3} aria-label="star" />,
        accessor: 'isFavorite',
        disableGlobalFilter: true,
        Cell: ({ row }: any) => {
          return row.original.isFavorite ? (
            <button
              onClick={() => {
                skipPageResetRef.current = true;
                updateFavorite?.(row.original.id, 'removeFavorite');
              }}
              type="button"
              role="checkbox"
              data-testid={`${row.original.modelName}-favorite`}
              className="usa-button usa-button--unstyled display-block"
              aria-label={`Click to unfavorite ${row.original.modelName} model plan`}
              aria-checked="true"
            >
              <Icon.Star data-cy="favorited" size={3} aria-label="star" />
            </button>
          ) : (
            <button
              onClick={() => {
                skipPageResetRef.current = true;
                updateFavorite?.(row.original.id, 'addFavorite');
              }}
              type="button"
              role="checkbox"
              data-testid={`${row.original.modelName}-unfavorite`}
              className="usa-button usa-button--unstyled display-block"
              aria-label={`Click to favorite ${row.original.modelName} model plan`}
              aria-checked="false"
            >
              <Icon.StarOutline
                data-cy="unfavorited"
                aria-label="star outline"
                size={3}
                className="text-gray-30"
              />
            </button>
          );
        }
      },
      modelName: {
        id: 'modelName',
        Header: homeT('requestsTable.headers.name'),
        accessor: 'modelName',
        Cell: ({ row, value }: any) => {
          const filteredNameHistory: string[] =
            row.original.nameHistory?.slice(1);
          return (
            <>
              <UswdsReactLink
                to={`/models/${row.original.id}/${
                  !isHome ? 'read-only/model-basics' : 'collaboration-area'
                }`}
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
      abbreviation: {
        id: 'abbreviation',
        Header: homeT('requestsTable.headers.abbreviation'),
        accessor: 'abbreviation'
      },
      amsModelID: {
        id: 'amsModelID',
        Header: homeT('requestsTable.headers.amsModelID'),
        accessor: 'basics.amsModelID'
      },
      modelCategory: {
        id: 'modelCategory',
        Header: homeT('requestsTable.headers.category'),
        accessor: 'basics.modelCategory',
        Cell: ({ row, value }: any) => {
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
      status: {
        id: 'status',
        Header: homeT('requestsTable.headers.status'),
        accessor: ({ status }: any) => {
          return i18next.t(`modelPlan:status.options.${status}`);
        },
        Cell: ({ value }: any) => {
          return value;
        }
      },
      clearanceDate: {
        id: 'clearanceDate',
        Header: homeT('requestsTable.headers.clearanceDate'),
        accessor: ({ timeline: { clearanceStarts } }: any) => {
          if (clearanceStarts) {
            return formatDateUtc(clearanceStarts, 'MM/dd/yyyy');
          }
          return null;
        },
        Cell: ({ value }: any) => {
          if (!value) {
            return <div>{homeT('requestsTable.tbd')}</div>;
          }
          return value;
        }
      },
      startDate: {
        id: 'startDate',
        Header: homeT('requestsTable.headers.startDate'),
        accessor: ({ timeline: { performancePeriodStarts } }: any) => {
          if (performancePeriodStarts) {
            return formatDateUtc(performancePeriodStarts, 'MM/dd/yyyy');
          }
          return null;
        },
        Cell: ({ value }: any) => {
          if (!value) {
            return <div>{homeT('requestsTable.tbd')}</div>;
          }
          return value;
        }
      },
      mostRecentEdit: {
        id: 'mostRecentEdit',
        Header: homeT('requestsTable.headers.recentActivity'),
        // @ts-ignore
        accessor: (value: AllModelPlansType) => {
          return value.mostRecentEdit?.date || value.createdDts;
        },
        Cell: ({ row, value }: any) => {
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
      },
      paymentDate: {
        id: 'paymentDate',
        Header: homeT('requestsTable.headers.paymentDate'),
        accessor: ({ payments: { paymentStartDate } }: any) => {
          if (paymentStartDate) {
            return formatDateUtc(paymentStartDate, 'MM/dd/yyyy');
          }
          return null;
        },
        Cell: ({ value }: any) => {
          if (!value) {
            return <div>{homeT('requestsTable.tbd')}</div>;
          }
          return value;
        }
      },
      keyCharacteristics: {
        id: 'keyCharacteristics',
        Header: homeT('requestsTable.headers.keyCharacteristics'),
        accessor: 'generalCharacteristics.keyCharacteristics',
        Cell: ({ value }: any) => {
          if (value) {
            return value
              .map((characteristics: KeyCharacteristic) => {
                return i18next.t(
                  `generalCharacteristics:keyCharacteristics.options.${characteristics}`
                );
              })
              .join(', ');
          }
          return null;
        }
      },
      demoCode: {
        id: 'demoCode',
        Header: homeT('requestsTable.headers.demoCode'),
        accessor: 'basics.demoCode'
      },
      crTdls: {
        id: 'echimpCRsAndTDLs',
        Header: homeT('requestsTable.headers.crTDLs'),
        accessor: 'echimpCRsAndTDLs',
        Cell: ({ value }: { value: EchimpCrAndTdlsType[] }) => {
          if (!value || value.length === 0) {
            return <div>{homeT('requestsTable.tbd')}</div>;
          }

          return (
            <ul className="margin-0">
              {value.map((crtdl: EchimpCrAndTdlsType) => (
                <li key={crtdl.id}>{crtdl.id}</li>
              ))}
            </ul>
          );
        }
      },
      modelPoc: {
        id: 'modelPoc',
        Header: homeT('requestsTable.headers.modelPoc'),
        accessor: 'collaborators',
        Cell: ({ value }: any) => {
          if (value) {
            const leads = value.filter((item: CollaboratorsType) => {
              return item.teamRoles.includes(TeamRole.MODEL_LEAD);
            });
            return (
              <>
                {leads.map((item: CollaboratorsType, index: number) => {
                  return `${item.userAccount.commonName}${
                    index === leads.length - 1 ? '' : ', '
                  }`;
                })}
              </>
            );
          }
          return <></>;
        }
      }
    };

    const columnList: any = [...tableColumns[type]].map(
      column => columnOptions[column]
    );

    return columnList;
  }, [homeT, updateFavorite, type, isHome]);

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

  if (!data.length && loading) {
    return <PageLoading testId={id} />;
  }

  if (error) {
    return <Alert type="error">{homeT('fetchError')}</Alert>;
  }

  if (data.length === 0) {
    return (
      <Alert type="info" heading={homeT(`settings.${type}.noResultsHeading`)}>
        {homeT(`settings.${type}.noResultsDescription`)}
      </Alert>
    );
  }

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

  const modelsStyle = (index: number) => {
    return {
      minWidth:
        (!isHome && index === 0 && '50px') ||
        (!isHome && index === 2 && '100px') ||
        (!isHome && index === 3 && '100px') ||
        '138px',
      padding: index === 0 ? '0' : 'auto',
      paddingTop: index === 0 ? '0rem' : 'auto',
      paddingLeft: '0',
      paddingBottom: index === 0 ? '0rem' : '.5rem'
    };
  };

  return (
    <div className="model-plan-table" data-testid={`${id}-wrapper`}>
      <div className="mint-header__basic display-flex flex-justify flex-align-self-start">
        <div>
          {canSearch && (
            <GlobalClientFilter
              skipPageResetRef={skipPageResetRef}
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
              tableID={homeT('requestsTable.id')}
              tableName={homeT('requestsTable.title')}
              className="margin-bottom-4 maxw-none width-mobile-lg"
            />
          )}

          {canSearch && !!state.globalFilter && (
            <TableResults
              globalFilter={state.globalFilter}
              pageIndex={state.pageIndex}
              pageSize={state.pageSize}
              filteredRowLength={page.length}
              rowLength={data.length}
            />
          )}
        </div>

        <>
          {type === ViewCustomizationType.ALL_MODEL_PLANS && (
            <div className="display-flex flex-align-start padding-top-1">
              <CsvExportLink />
              <Button
                type="button"
                className="usa-button usa-button--unstyled display-flex margin-left-4"
                onClick={() => {
                  downloadMTOMilestoneSummary(
                    mtoMilestoneSummaryData,
                    'mto-milestone-summary.xlsx'
                  );
                }}
              >
                <Icon.FileDownload
                  className="margin-right-1"
                  aria-label="download"
                />
                {homeT('downloadMTOMilestoneSummary')}
              </Button>
            </div>
          )}
        </>
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
                  // @ts-ignore
                  .filter((column, index) => !hiddenColumns?.includes(index))
                  .map((column, index) => (
                    <th
                      {...column.getHeaderProps()}
                      aria-sort={getColumnSortStatus(column)}
                      className="table-header"
                      scope="col"
                      style={!isHome ? modelsStyle(index) : homeStyle(index)}
                      key={column.id}
                    >
                      <button
                        className={classNames(
                          'usa-button usa-button--unstyled position-relative',
                          {
                            'margin-top-1': index === 0 && !isHome
                          }
                        )}
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

      {canSearch && data.length > 10 && (
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

export default ModelPlansTable;
