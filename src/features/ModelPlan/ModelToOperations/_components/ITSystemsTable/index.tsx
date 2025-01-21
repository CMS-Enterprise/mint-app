import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Column, usePagination, useSortBy, useTable } from 'react-table';
import { Button, Icon, Table } from '@trussworks/react-uswds';
import classNames from 'classnames';
import SolutionDetailsModal from 'features/HelpAndKnowledge/SolutionsHelp/SolutionDetails/Modal';
import { helpSolutions } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { NotFoundPartial } from 'features/NotFound';
import {
  MtoRiskIndicator,
  useGetMtoSolutionsAndMilestonesQuery
} from 'gql/generated/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import TablePagination from 'components/TablePagination';
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

import MilestoneStatusTag from '../MTOStatusTag';

const ITSystemsTable = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  const history = useHistory();

  const { location } = history;

  const { clearMessage } = useMessage();

  const { setMTOModalOpen, setMTOModalState } = useContext(MTOModalContext);

  const { prevPathname, selectedSolution } = useModalSolutionState();

  const { data, loading, error } = useGetMtoSolutionsAndMilestonesQuery({
    variables: { id: modelID }
  });

  const solutions = useMemo(() => {
    if (!data) return [];
    const { mtoMatrix } = data.modelPlan;

    const formattedSolutions = [...mtoMatrix.solutions].sort((a, b) => {
      return sortColumnValues(a.name!, b.name!);
    });

    // Format milestones with no linked solutions to display in the table as solutions
    mtoMatrix.milestonesWithNoLinkedSolutions.forEach((milestone: any) => {
      formattedSolutions.push({
        __typename: 'MTOMilestone' as 'MTOSolution',
        id: milestone.id,
        name: milestone.name,
        riskIndicator: MtoRiskIndicator.ON_TRACK,
        milestones: [],
        facilitatedBy: [],
        neededBy: null,
        status: null as any
      });
    });

    return formattedSolutions;
  }, [data]);

  const columns = useMemo<Column<any>[]>(() => {
    return [
      {
        Header: <Icon.Warning size={3} className="left-05 text-base-lighter" />,
        accessor: 'riskIndicator',
        Cell: ({ row }: any) => {
          const { riskIndicator } = row.original;

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
        accessor: 'name',
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
          if (
            !row?.orignal?.facilitatedBy ||
            row.original.__typename === 'MTOMilestone'
          )
            return <></>;

          return (
            <>
              {row.orignal.facilitatedBy
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
          if (row.original.__typename === 'MTOMilestone') return <></>;

          if (!row.needBy)
            return <span className="text-italic">{t('table.noneAdded')}</span>;

          return <>{formatDateUtc(row.needBy, 'MM/dd/yyyy')}</>;
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
        accessor: 'actions'
      }
    ];
  }, [
    t,
    clearMessage,
    setMTOModalState,
    setMTOModalOpen,
    location.pathname,
    location.search
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
        pageIndex: 0
      }
    },
    useSortBy,
    usePagination
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
    <div className={classNames('model-plan-table margin-top-4')}>
      {/* {renderModal && selectedSolution && (
        <SolutionDetailsModal
          solution={selectedSolution}
          openedFrom={prevPathname}
          closeRoute={() => {
            params.delete('solution');
            params.delete('section');
            return `${history.location.pathname}`;
          }}
        />
      )} */}

      {selectedSolution && (
        <SolutionDetailsModal
          solution={selectedSolution}
          openedFrom={prevPathname}
          closeRoute={location.pathname}
        />
      )}

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
