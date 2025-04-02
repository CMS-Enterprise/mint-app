import React, { useContext, useMemo } from 'react';
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
import { MTOModalContext } from 'contexts/MTOModalContext';
import useMessage from 'hooks/useMessage';
import useModalSolutionState from 'hooks/useModalSolutionState';
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

const ITSystemsTable = () => {
  const { t } = useTranslation('modelToOperationsMisc');
  const { t: mtoSolutionT } = useTranslation('mtoSolution');

  const { modelID } = useParams<{ modelID: string }>();

  const history = useHistory();

  const { location } = history;

  const params = new URLSearchParams(history.location.search);

  const { openEditSolutionModal, setSolutionID } = useContext(
    EditMTOSolutionContext
  );

  const hideMilestonesWithoutSolutions =
    params.get('hide-milestones-without-solutions') === 'true';

  let viewParam: SolutionViewType = 'all';

  if (params.get('view')) {
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
        (milestone: any) => {
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
          if (row.original.__typename === 'MTOMilestone')
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
          if (row.original.__typename === 'MTOMilestone')
            return <>{row.original.name}</>;

          const { milestones } = row.original;

          if (!milestones || milestones?.length === 0)
            return <>{t('table.noRelatedMilestones')}</>;

          return (
            <>
              {milestones[0].name}{' '}
              {milestones.length > 1 && (
                <Button
                  type="button"
                  unstyled
                  onClick={() => {
                    // TODO: Open edit solution panel
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
    mtoSolutionT
  ]);

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
      columns,
      data: filteredView,
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

  return (
    <div className={classNames('margin-top-4 line-height-normal')}>
      {selectedSolution && (
        <SolutionDetailsModal
          solution={selectedSolution}
          openedFrom={prevPathname}
          closeRoute={location.pathname}
        />
      )}

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
                    width: index === 2 ? '260px' : column.width || 'auto'
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

      {/* Pagination */}

      <div className="display-flex flex-wrap">
        {filteredView.length > state.pageSize && (
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

        {filteredView.length > 0 && (
          <TablePageSize
            className="margin-left-auto desktop:grid-col-auto"
            pageSize={state.pageSize}
            setPageSize={setPageSize}
            valueArray={[5, 10, 'all']}
            suffix={t('table.solutions').toLowerCase()}
          />
        )}
      </div>

      <div
        className="usa-sr-only usa-table__announcement-region"
        aria-live="polite"
      >
        {currentTableSortDescription(headerGroups[0])}
      </div>

      {filteredView.length === 0 && (
        <Alert type="info" slim>
          {viewParam === 'all'
            ? t('table.alert.noSolutions')
            : t('table.alert.noFilterSelections')}
        </Alert>
      )}
    </div>
  );
};

export default ITSystemsTable;
