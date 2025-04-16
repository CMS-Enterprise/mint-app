import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Column,
  usePagination as usePaginationTable,
  useSortBy,
  useTable
} from 'react-table';
import { Button, Grid, Icon, Table } from '@trussworks/react-uswds';
import classNames from 'classnames';
import SolutionDetailsModal from 'features/HelpAndKnowledge/SolutionsHelp/SolutionDetails/Modal';
import { helpSolutions } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { NotFoundPartial } from 'features/NotFound';
import {
  GetMtoSolutionsAndMilestonesQuery,
  MtoCommonSolutionKey,
  MtoRiskIndicator,
  MtoSolutionStatus,
  MtoSolutionType,
  useGetMtoSolutionsAndMilestonesQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import TablePageSize from 'components/TablePageSize';
import TablePagination from 'components/TablePagination';
import { EditMTOSolutionContext } from 'contexts/EditMTOSolutionContext';
import {
  MTOMilestonePanelContext,
  MTOMilestonePanelProvider
} from 'contexts/MTOMilestonePanelContext';
import { MTOModalContext } from 'contexts/MTOModalContext';
import {
  MTOSolutionPanelContext,
  MTOSolutionPanelProvider
} from 'contexts/MTOSolutionPanelContext';
import { PrintPDFContext } from 'contexts/PrintPDFContext';
import useMessage from 'hooks/useMessage';
import useModalSolutionState from 'hooks/useModalSolutionState';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { formatDateUtc } from 'utils/date';
import globalFilterCellText from 'utils/globalFilterCellText';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';

import { SolutionViewType } from '../../SolutionLibrary';
import MTORiskIndicatorTag from '../MTORiskIndicatorIcon';
import MilestoneStatusTag from '../MTOStatusTag';
import SolutionViewSelector from '../SolutionViewSelector';

export type SolutionType =
  GetMtoSolutionsAndMilestonesQuery['modelPlan']['mtoMatrix']['solutions'][0];

const ITSystemsTable = ({
  readView,
  filterSolutions
}: {
  readView?: boolean;
  filterSolutions?: MtoCommonSolutionKey[];
}) => {
  const { t } = useTranslation('modelToOperationsMisc');
  const { t: mtoSolutionT } = useTranslation('mtoSolution');

  const { modelID } = useParams<{ modelID: string }>();

  const history = useHistory();

  const { location } = history;

  const params = new URLSearchParams(history.location.search);

  const { openEditSolutionModal, setSolutionID } = useContext(
    EditMTOSolutionContext
  );

  const paramType = readView ? 'type' : 'view';

  const hideMilestonesWithoutSolutions =
    params.get('hide-milestones-without-solutions') === 'true';

  let viewParam: SolutionViewType = 'all';

  if (params.get(paramType)) {
    const view = params.get('type') as SolutionViewType;
    if (['all', 'it-systems', 'contracts', 'other-solutions'].includes(view)) {
      viewParam = view;
    }
  }

  const { clearMessage } = useMessage();

  const { setMTOModalOpen, setMTOModalState } = useContext(MTOModalContext);

  const { prevPathname, selectedSolution } = useModalSolutionState();

  const { data, loading, error } = useGetMtoSolutionsAndMilestonesQuery({
    variables: { id: modelID }
  });

  const milestonesWithoutSolutions = useMemo(
    () =>
      data?.modelPlan.mtoMatrix.milestonesWithNoLinkedSolutions.map(
        milestone => {
          // Format milestones with no linked solutions to display in the table as solutions
          const formattedTableMilestone: SolutionType = {
            __typename: 'MTOMilestone' as 'MTOSolution',
            id: milestone.id,
            name: milestone.name,
            riskIndicator: MtoRiskIndicator.ON_TRACK,
            milestones: [],
            facilitatedBy: [],
            neededBy: null,
            status: MtoSolutionStatus.NOT_STARTED,
            addedFromSolutionLibrary: false
          };
          return formattedTableMilestone;
        }
      ) || [],
    [data?.modelPlan.mtoMatrix.milestonesWithNoLinkedSolutions]
  );

  const solutions = useMemo(() => {
    if (!data) return [];

    const sortedSolutions = [...data?.modelPlan.mtoMatrix.solutions].sort(
      (a, b) => {
        return sortColumnValues(a.name!, b.name!);
      }
    );

    return sortedSolutions;
  }, [data]);

  const readViewFilterSolutions = useMemo(() => {
    let readViewSolutions = data?.modelPlan.mtoMatrix.solutions || [];

    // Filter out solutions that are not a part of the filter groups mapping/filterSolutions array prop
    if (filterSolutions) {
      readViewSolutions = readViewSolutions.filter((solution: any) => {
        return filterSolutions?.includes(solution.key);
      });
    }

    return readViewSolutions;
  }, [data, filterSolutions]);

  const solutionsAndMilestones = useMemo(() => {
    if (!hideMilestonesWithoutSolutions) {
      return [...solutions].concat([...milestonesWithoutSolutions]);
    }
    return solutions;
  }, [hideMilestonesWithoutSolutions, milestonesWithoutSolutions, solutions]);

  const itSystemsSolutions = useMemo(
    () =>
      solutions.filter(item => {
        return item.type === MtoSolutionType.IT_SYSTEM;
      }),
    [solutions]
  );

  const contractsSolutions = useMemo(
    () =>
      solutions.filter(item => {
        return item.type === MtoSolutionType.CONTRACTOR;
      }),
    [solutions]
  );

  const otherSolutions = useMemo(
    () =>
      solutions.filter(item => {
        return item.type === MtoSolutionType.OTHER;
      }),
    [solutions]
  );

  const filteredView = useMemo(() => {
    const views = {
      'it-systems': itSystemsSolutions,
      contracts: contractsSolutions,
      'other-solutions': otherSolutions,
      'cross-cut': [],
      all: solutionsAndMilestones
    };
    return views[viewParam];
  }, [
    viewParam,
    itSystemsSolutions,
    contractsSolutions,
    otherSolutions,
    solutionsAndMilestones
  ]);

  const columns = useMemo<Column<any>[]>(() => {
    return [
      {
        Header: <Icon.Warning size={3} className="left-05 text-base-lighter" />,
        accessor: 'riskIndicator',
        width: 40,
        Cell: ({ row }: any) => {
          const { riskIndicator } = row.original;

          return <MTORiskIndicatorTag riskIndicator={riskIndicator} />;
        }
      },
      {
        Header: t<string, {}, string>('table.solution'),
        accessor: 'name',
        width: 250,
        Cell: ({ row }: any) => {
          const { openViewSolutionModal, setViewSolutionID } = useContext(
            MTOSolutionPanelContext
          );

          if (row.original.__typename === 'MTOMilestone') {
            if (readView) {
              return <div className="text-italic">{t('table.noneAdded')}</div>;
            }

            return (
              <Button
                type="button"
                className="display-block text-bold"
                unstyled
                onClick={() => {
                  if (clearMessage) clearMessage();
                  if (setMTOModalState)
                    setMTOModalState({
                      modalType: 'selectSolution',
                      milestoneID: row.original.id
                    });
                  if (setMTOModalOpen) setMTOModalOpen(true);
                }}
              >
                {t('table.selectASolution')}
                <Icon.ArrowForward className="top-05 margin-left-05" />
              </Button>
            );
          }

          if (readView) {
            return (
              <Button
                type="button"
                unstyled
                onClick={() => {
                  openViewSolutionModal(row.original.id);
                  setViewSolutionID(row.original.id);
                }}
              >
                {row.original.name}
              </Button>
            );
          }

          const mappedSolution = helpSolutions.find(
            s => s.enum === row.original.key
          );

          if (!row.original.addedFromSolutionLibrary) {
            return <>{row.original.name}</>;
          }

          return (
            <UswdsReactLink
              to={`${location.pathname}${location.search}${
                location.search ? '&' : '?'
              }solution=${mappedSolution?.route}&section=about`}
            >
              {row.original.name}
            </UswdsReactLink>
          );
        }
      },
      {
        Header: t<string, {}, string>('table.relatedMilestones'),
        accessor: 'milestones',
        Cell: ({ row }: any) => {
          const { openEditMilestoneModal, setMilestoneID } = useContext(
            MTOMilestonePanelContext
          );

          const { openViewSolutionModal, setViewSolutionID } = useContext(
            MTOSolutionPanelContext
          );

          if (row.original.__typename === 'MTOMilestone')
            return <>{row.original.name}</>;

          const { milestones } = row.original;

          if (!milestones || milestones?.length === 0)
            return <>{t('table.noRelatedMilestones')}</>;

          return (
            <>
              {readView ? (
                <Button
                  type="button"
                  unstyled
                  onClick={() => {
                    openEditMilestoneModal(milestones[0].id);
                    setMilestoneID(milestones[0].id);
                  }}
                >
                  {milestones[0].name}
                </Button>
              ) : (
                milestones[0].name
              )}{' '}
              {milestones.length > 1 && (
                <Button
                  type="button"
                  unstyled
                  onClick={() => {
                    if (readView) {
                      openViewSolutionModal(row.original.id);
                      setViewSolutionID(row.original.id);
                    } else {
                      setSolutionID(row.original.id);
                      openEditSolutionModal(row.original.id);
                    }

                    // Adds scroll param to existing params
                    const existingParams = new URLSearchParams(
                      history.location.search
                    );
                    existingParams.set('scroll-to-bottom', 'true');
                    history.replace({ search: existingParams.toString() });
                  }}
                >
                  {t('table.moreMilestones', {
                    count: milestones.length - 1
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
          const { facilitatedBy } = row.original || {};

          if (!facilitatedBy || row.original.__typename === 'MTOMilestone')
            return <></>;

          return (
            <>
              {facilitatedBy
                .map((facilitator: any) =>
                  mtoSolutionT(`facilitatedBy.options.${facilitator}`)
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
          if (row.original.__typename === 'MTOMilestone') return <></>;

          if (!row.original.neededBy)
            return <span className="text-italic">{t('table.noneAdded')}</span>;

          return <>{formatDateUtc(row.original.neededBy, 'MM/dd/yyyy')}</>;
        }
      },
      {
        Header: t('table.status'),
        accessor: 'status',
        Cell: ({ row }: any) => {
          if (row.original.__typename === 'MTOMilestone') return <></>;

          const { status } = row.original;

          return (
            <MilestoneStatusTag status={status} classname="width-fit-content" />
          );
        }
      },
      {
        Header: t<string, {}, string>('table.actions'),
        accessor: 'actions',
        width: 120,
        Cell: ({ row }: any) => {
          if (row.original.__typename === 'MTOMilestone') return <></>;

          return (
            <div style={{ textAlign: 'right' }}>
              <Button
                type="button"
                unstyled
                className="margin-right-2"
                onClick={() => {
                  setSolutionID(row.original.id);
                  openEditSolutionModal(row.original.id);
                }}
              >
                {t('table.editDetails')}
              </Button>
            </div>
          );
        }
      }
    ];
  }, [
    t,
    clearMessage,
    setMTOModalState,
    setMTOModalOpen,
    location.pathname,
    location.search,
    openEditSolutionModal,
    setSolutionID,
    mtoSolutionT,
    readView,
    history
  ]);

  const filteredColumns = useMemo(() => {
    if (readView) {
      // Remove the Actions from the columns array if in readview
      return columns.slice(0, -1);
    }
    return columns;
  }, [readView, columns]);

  const tableData = filterSolutions ? readViewFilterSolutions : filteredView;

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
    rows,
    prepareRow
  } = useTable(
    {
      columns: filteredColumns,
      data: tableData,
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
      initialState: {
        pageIndex: 0,
        pageSize: 5
      }
    },
    useSortBy,
    usePaginationTable
  );

  // isPrintPDF is a boolean that is set to true when the user is printing the PDF
  const { isPrintPDF } = useContext(PrintPDFContext);

  const [initPageSize] = useState(state.pageSize);

  useEffect(() => {
    if (isPrintPDF) {
      setPageSize(1000);
    } else {
      setPageSize(initPageSize);
    }
  }, [isPrintPDF, setPageSize, initPageSize]);

  if (!data && loading) {
    return <PageLoading />;
  }

  if (error) {
    return <NotFoundPartial />;
  }

  // Temp fix for `globalFilterCellText` to work with `page` rows
  // The filter function requires all rows to be prepped so that
  // `Column.Cell` is available during filtering
  rows.map(row => prepareRow(row));

  const renderTable =
    (tableData.length > 0 && filterSolutions) || !filterSolutions;

  return (
    <MTOMilestonePanelProvider>
      <MTOSolutionPanelProvider>
        <div className={classNames('margin-top-4 line-height-normal')}>
          {selectedSolution && (
            <SolutionDetailsModal
              solution={selectedSolution}
              openedFrom={prevPathname}
              closeRoute={location.pathname}
            />
          )}

          {!filterSolutions && (
            <div className="mint-no-print">
              <Grid
                desktop={{ col: 12 }}
                className="desktop:display-flex flex-wrap margin-bottom-2"
              >
                <SolutionViewSelector
                  viewParam={viewParam}
                  type="table"
                  usePages={false}
                  allSolutions={solutionsAndMilestones}
                  itSystemsSolutions={itSystemsSolutions}
                  contractsSolutions={contractsSolutions}
                  otherSolutions={otherSolutions}
                />

                <CheckboxField
                  id="hide-added-solutions"
                  name="hide-added-solutions"
                  label={t('solutionTable.hideAdded', {
                    count: milestonesWithoutSolutions.length
                  })}
                  value="true"
                  checked={hideMilestonesWithoutSolutions}
                  onBlur={() => null}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    params.set(
                      'hide-milestones-without-solutions',
                      hideMilestonesWithoutSolutions ? 'false' : 'true'
                    );
                    history.replace({ search: params.toString() });
                  }}
                />
              </Grid>
            </div>
          )}

          {renderTable && (
            <>
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
                            width:
                              index === 2 ? '260px' : column.width || 'auto'
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
                    // need to destructure row and getRowProps to avoid TS error for prop-types
                    const { getRowProps, cells, id } = { ...row };
                    return (
                      <tr {...getRowProps()} key={id}>
                        {cells.map((cell, i) => {
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
              <div className="mint-no-print">
                <div className="display-flex flex-wrap">
                  {tableData.length > state.pageSize && (
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

                  {tableData.length > 5 && (
                    <TablePageSize
                      className="margin-left-auto desktop:grid-col-auto"
                      pageSize={state.pageSize}
                      setPageSize={setPageSize}
                      valueArray={[5, 10, 'all']}
                      suffix={t('table.solutions').toLowerCase()}
                    />
                  )}
                </div>
              </div>

              <div
                className="usa-sr-only usa-table__announcement-region"
                aria-live="polite"
              >
                {currentTableSortDescription(headerGroups[0])}
              </div>
            </>
          )}

          <FilterViewSolutionsAlert
            filterSolutions={filterSolutions}
            solutions={tableData}
          />

          {/* Pagination */}

          {filteredView.length === 0 && (
            <Alert type="info" slim>
              {viewParam === 'all'
                ? t('table.alert.noSolutions')
                : t('table.alert.noFilterSelections')}
            </Alert>
          )}
        </div>
      </MTOSolutionPanelProvider>
    </MTOMilestonePanelProvider>
  );
};

export default ITSystemsTable;

export const FilterViewSolutionsAlert = ({
  filterSolutions,
  solutions
}: {
  filterSolutions: MtoCommonSolutionKey[] | undefined;
  solutions: SolutionType[];
}) => {
  const { t: opSolutionsMiscT } = useTranslation('opSolutionsMisc');
  const { commonSolutions: commonSolutionsConfig } =
    usePlanTranslation('mtoMilestone');

  if (!filterSolutions) return null;

  const unusedSolutions = filterSolutions.filter(
    solution => !solutions.find((need: any) => need.key === solution)
  );
  if (unusedSolutions.length === 0) return null;

  return (
    <Alert noIcon type="info" validation>
      {opSolutionsMiscT('itSolutionsTable.unusedSolutionsAlert')}
      <ul className="margin-top-1 margin-bottom-0">
        {unusedSolutions.map(solution => (
          <li key={solution}>{commonSolutionsConfig.options[solution]}</li>
        ))}
      </ul>
    </Alert>
  );
};
