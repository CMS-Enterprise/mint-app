import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Column,
  Row,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import {
  Grid,
  GridContainer,
  Icon,
  Table as UswdsTable
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { helpSolutions } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import MTORiskIndicatorTag from 'features/ModelPlan/ModelToOperations/_components/MTORiskIndicatorIcon';
import SolutionStatusTag from 'features/ModelPlan/ModelToOperations/_components/MTOStatusTag';
import MTOTag from 'features/ModelPlan/ModelToOperations/_components/MTOTag';
import {
  GetMtoSolutionQuery,
  MtoRiskIndicator,
  MtoSolutionStatus,
  useGetMtoSolutionQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/DescriptionGroup';
import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import TablePagination from 'components/TablePagination';
import Tooltip from 'components/Tooltip';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { formatDateUtc } from 'utils/date';
import { getHeaderSortIcon } from 'utils/tableSort';

export type SolutionType = GetMtoSolutionQuery['mtoSolution'];

type EditSolutionFormProps = {
  closeModal: () => void;
};

const SolutionPanel = ({ closeModal }: EditSolutionFormProps) => {
  const { t: mtoSolutionT } = useTranslation('mtoSolution');
  const { t: modelToOperationsMiscT } = useTranslation('modelToOperationsMisc');

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  const { status: stausConfig, riskIndicator: riskIndicatorConfig } =
    usePlanTranslation('mtoSolution');

  const history = useHistory();

  const params = new URLSearchParams(history.location.search);

  const viewSolutionID = params.get('view-solution');

  const {
    data,
    loading,
    error: queryError
  } = useGetMtoSolutionQuery({
    variables: {
      id: viewSolutionID || ''
    }
  });

  const solution = useMemo(() => {
    return (
      data?.mtoSolution ||
      ({
        __typename: 'MTOSolution',
        id: '',
        name: '',
        status: MtoSolutionStatus.NOT_STARTED,
        key: null,
        facilitatedBy: null,
        riskIndicator: MtoRiskIndicator.ON_TRACK,
        addedFromSolutionLibrary: false,
        milestones: [],
        isDraft: false
      } as GetMtoSolutionQuery['mtoSolution'])
    );
  }, [data]);

  const solutionRoute: string | undefined = helpSolutions.find(
    sol => sol.enum === solution?.key
  )?.route;

  const columns: Column<SolutionType>[] = useMemo(
    () => [
      {
        Header: modelToOperationsMiscT('modal.editSolution.milestone'),
        accessor: 'name'
      },
      {
        Header: modelToOperationsMiscT('modal.editSolution.status'),
        accessor: 'status',
        Cell: ({ row }: { row: Row<SolutionType> }) => {
          return (
            <SolutionStatusTag
              status={row.original.status}
              classname="width-fit-content"
            />
          );
        }
      },
      {
        Header: <Icon.Warning size={3} className="left-05 text-base-lighter" />,
        accessor: 'riskIndicator',
        disableSortBy: true,
        Cell: ({ row }: { row: Row<SolutionType> }) => {
          const { riskIndicator } = row.original;

          if (!riskIndicator) return <></>;

          return (
            <MTORiskIndicatorTag riskIndicator={riskIndicator} showTooltip />
          );
        }
      }
    ],
    [modelToOperationsMiscT]
  );

  const {
    getTableProps,
    getTableBodyProps,
    gotoPage,
    headerGroups,
    nextPage,
    page,
    pageOptions,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageCount,
    setPageSize,
    state,
    rows,
    prepareRow
  } = useTable(
    {
      columns: columns as Column<object>[],
      data: solution?.milestones || [],
      initialState: { pageIndex: 0, pageSize: 5 }
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  rows.map(row => prepareRow(row));

  if (loading && !data) {
    return <PageLoading />;
  }

  if (!data || queryError) {
    return null;
  }

  const NoneSpecified = (
    <p className="margin-0 text-base-dark text-italic">
      {modelToOperationsMiscT('modal.editSolution.noneSpecified')}
    </p>
  );

  return (
    <>
      <GridContainer
        className={classNames({
          'padding-8': !isTablet,
          'padding-4': isTablet
        })}
      >
        <Grid row>
          <Grid col={10}>
            <div className="display-flex">
              {!solution.addedFromSolutionLibrary && (
                <MTOTag
                  type="custom"
                  label={modelToOperationsMiscT('modal.editSolution.custom')}
                  tooltip={modelToOperationsMiscT(
                    'modal.editSolution.customTooltip'
                  )}
                />
              )}
            </div>

            <h2>{solution.name}</h2>

            <p className="margin-0 mint-body-normal text-base-dark">
              {mtoSolutionT(`solutionType.options.${solution.type}`)}
            </p>

            {solution.addedFromSolutionLibrary && (
              <div className="margin-top-2">
                <UswdsReactLink
                  to={`/help-and-knowledge/operational-solutions?page=1&solution=${solutionRoute}&section=about`}
                  target="_blank"
                  variant="external"
                >
                  {modelToOperationsMiscT('modal.editSolution.learnMore')}
                </UswdsReactLink>
              </div>
            )}

            <div className="border-base-light border-top-1px border-bottom-1px padding-y-3 margin-y-4">
              <Grid row className="margin-bottom-2">
                <Grid tablet={{ col: 12 }} mobile={{ col: 12 }}>
                  <DescriptionTerm
                    className="font-body-sm margin-bottom-0"
                    term={mtoSolutionT('facilitatedBy.label')}
                  />
                  <DescriptionDefinition
                    className="font-body-md text-base-darkest"
                    definition={
                      solution.facilitatedBy
                        ? solution.facilitatedBy
                            .map((facilitator: any) =>
                              mtoSolutionT(
                                `facilitatedBy.options.${facilitator}`
                              )
                            )
                            .join(', ')
                        : NoneSpecified
                    }
                  />
                </Grid>
              </Grid>

              <Grid row className="margin-bottom-2">
                <Grid tablet={{ col: 6 }} mobile={{ col: 12 }}>
                  <DescriptionTerm
                    className="font-body-sm margin-bottom-0"
                    term={mtoSolutionT('neededBy.label')}
                  />
                  <DescriptionDefinition
                    className="font-body-md text-base-darkest"
                    definition={
                      solution.neededBy
                        ? formatDateUtc(solution.neededBy, 'MM/dd/yyyy')
                        : NoneSpecified
                    }
                  />
                </Grid>
              </Grid>

              <Grid row className="margin-bottom-2">
                <Grid tablet={{ col: 6 }} mobile={{ col: 12 }}>
                  <DescriptionTerm
                    className="font-body-sm margin-bottom-0"
                    term={
                      <>
                        {mtoSolutionT('status.label')}
                        <Tooltip
                          wrapperclasses="top-2px margin-left-1"
                          label={stausConfig.questionTooltip}
                          position="right"
                        >
                          <Icon.Info className="text-base-light" />
                        </Tooltip>
                      </>
                    }
                  />
                  <DescriptionDefinition
                    className="font-body-md text-base-darkest"
                    definition={
                      <SolutionStatusTag
                        status={solution.status}
                        classname="width-fit-content"
                      />
                    }
                  />
                </Grid>

                <Grid tablet={{ col: 6 }} mobile={{ col: 12 }}>
                  <DescriptionTerm
                    className="font-body-sm margin-bottom-0"
                    term={
                      <>
                        {mtoSolutionT('riskIndicator.label')}
                        <Tooltip
                          wrapperclasses="top-2px margin-left-1"
                          label={riskIndicatorConfig.questionTooltip}
                          position="right"
                        >
                          <Icon.Info className="text-base-light" />
                        </Tooltip>
                      </>
                    }
                  />

                  <DescriptionDefinition
                    className="font-body-md text-base-darkest"
                    definition={
                      <div className="display-flex flex-align-end">
                        <div className="margin-right-1">
                          {solution.riskIndicator
                            ? riskIndicatorConfig.options[
                                solution.riskIndicator
                              ]
                            : NoneSpecified}
                        </div>
                        {solution.riskIndicator && (
                          <MTORiskIndicatorTag
                            riskIndicator={solution.riskIndicator}
                            showTooltip
                          />
                        )}
                      </div>
                    }
                  />
                </Grid>
              </Grid>
            </div>

            <h3 className="margin-bottom-1">
              {modelToOperationsMiscT(
                'modal.editSolution.selectedMilestoneCount',
                {
                  count: solution.milestones.length
                }
              )}
            </h3>

            {solution.milestones.length > 0 ? (
              <>
                <UswdsTable
                  bordered={false}
                  {...getTableProps()}
                  className="margin-top-0"
                  fullWidth
                >
                  <thead>
                    {headerGroups.map(headerGroup => (
                      <tr
                        {...headerGroup.getHeaderGroupProps()}
                        key={{ ...headerGroup.getHeaderGroupProps() }.key}
                      >
                        {headerGroup.headers.map(column => (
                          <th
                            {...column.getHeaderProps()}
                            scope="col"
                            key={column.id}
                            className="padding-left-0 padding-bottom-0"
                            style={{
                              width: column.id === 'status' ? '150px' : 'auto'
                            }}
                          >
                            <button
                              className="usa-button usa-button--unstyled position-relative"
                              type="button"
                              {...column.getSortByToggleProps()}
                            >
                              {column.render('Header')}
                              {column.canSort &&
                                getHeaderSortIcon(column, false)}
                            </button>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                      const { getRowProps, cells, id } = { ...row };

                      prepareRow(row);
                      return (
                        <tr {...getRowProps()} key={id}>
                          {cells.map(cell => {
                            return (
                              <td
                                {...cell.getCellProps()}
                                key={cell.getCellProps().key}
                                className="padding-left-0"
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

                {solution.milestones.length > 5 && (
                  <TablePagination
                    className="flex-justify-start margin-left-neg-05"
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
              </>
            ) : (
              <Alert type="info" slim className="margin-bottom-2">
                {modelToOperationsMiscT('modal.editSolution.noMilestonesTable')}
              </Alert>
            )}
          </Grid>
        </Grid>
      </GridContainer>
    </>
  );
};

export default SolutionPanel;
