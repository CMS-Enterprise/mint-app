import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import {
  Column,
  Row,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { Grid, Icon, Table as UswdsTable } from '@trussworks/react-uswds';
import MilestoneNotes from 'features/ModelPlan/ModelToOperations/_components/MilestoneNotes';
import MTORiskIndicatorTag from 'features/ModelPlan/ModelToOperations/_components/MTORiskIndicatorIcon';
import MilestoneStatusTag from 'features/ModelPlan/ModelToOperations/_components/MTOStatusTag';
import MTOTag from 'features/ModelPlan/ModelToOperations/_components/MTOTag';
import {
  GetMtoMilestoneQuery,
  MtoMilestoneResponsibleComponent,
  MtoMilestoneStatus,
  MtoRiskIndicator,
  useGetMtoMilestoneQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/DescriptionGroup';
import PageLoading from 'components/PageLoading';
import TablePagination from 'components/TablePagination';
import Tooltip from 'components/Tooltip';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getHeaderSortIcon } from 'utils/tableSort';

export type SolutionType = GetMtoMilestoneQuery['mtoMilestone']['solutions'][0];

type EditMilestoneFormProps = {
  closeModal: () => void;
};

const MilestonePanel = ({ closeModal }: EditMilestoneFormProps) => {
  const { t: mtoMilestoneT } = useTranslation('mtoMilestone');
  const { t: modelToOperationsMiscT } = useTranslation('modelToOperationsMisc');

  const { status: stausConfig, riskIndicator: riskIndicatorConfig } =
    usePlanTranslation('mtoMilestone');

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const viewMilestoneID = params.get('view-milestone');

  const {
    data,
    loading,
    error: queryError
  } = useGetMtoMilestoneQuery({
    variables: {
      id: viewMilestoneID || ''
    }
  });

  const sortedMilestoneNotes = useMemo(() => {
    return [...(data?.mtoMilestone.notes || [])].sort((a, b) => {
      return (
        new Date(b.createdDts).getTime() - new Date(a.createdDts).getTime()
      );
    });
  }, [data]);

  const milestone = useMemo(() => {
    return (
      data?.mtoMilestone ||
      ({
        __typename: 'MTOMilestone',
        id: '',
        name: '',
        description: '',
        status: MtoMilestoneStatus.NOT_STARTED,
        key: null,
        responsibleComponent: [],
        facilitatedBy: null,
        facilitatedByOther: null,
        riskIndicator: MtoRiskIndicator.ON_TRACK,
        addedFromMilestoneLibrary: false,
        solutions: [],
        isDraft: false,
        categories:
          [] as unknown as GetMtoMilestoneQuery['mtoMilestone']['categories'],
        notes: []
      } as GetMtoMilestoneQuery['mtoMilestone'])
    );
  }, [data]);

  const columns: Column<SolutionType>[] = useMemo(
    () => [
      {
        Header: modelToOperationsMiscT('modal.editMilestone.solution'),
        accessor: 'name'
      },
      {
        Header: modelToOperationsMiscT('modal.editMilestone.status'),
        accessor: 'status',
        Cell: ({ row }: { row: Row<SolutionType> }) => {
          return (
            <MilestoneStatusTag
              status={row.original.status}
              classname="width-fit-content"
            />
          );
        }
      },
      {
        Header: (
          <Icon.Warning
            size={3}
            className="left-05 text-base-lighter"
            aria-label="warning"
          />
        ),
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
      data: milestone?.solutions || [],
      initialState: { pageIndex: 0, pageSize: 5 }
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  rows.map(row => prepareRow(row));

  if (loading && !milestone) {
    return <PageLoading />;
  }

  if (!milestone || queryError) {
    return null;
  }

  const NoneSpecified = (
    <p className="margin-0 text-base-dark text-italic">
      {modelToOperationsMiscT('modal.editMilestone.noneSpecified')}
    </p>
  );

  return (
    <>
      <div className="padding-8 maxw-tablet">
        <div className="display-flex">
          {milestone.isDraft && (
            <MTOTag
              type="draft"
              label={modelToOperationsMiscT('milestoneLibrary.isDraft')}
              tooltip={mtoMilestoneT('isDraft.questionTooltip')}
            />
          )}

          {!milestone.addedFromMilestoneLibrary && (
            <MTOTag
              type="custom"
              label={modelToOperationsMiscT('modal.editMilestone.custom')}
              tooltip={modelToOperationsMiscT(
                'modal.editMilestone.customTooltip'
              )}
            />
          )}
        </div>

        <h2 className="line-height-large margin-top-1">{milestone.name}</h2>
        <div className="border-base-light border-top-1px border-bottom-1px padding-y-3 margin-bottom-4 margin-top-3">
          <Grid row className="margin-bottom-2">
            <Grid tablet={{ col: 6 }} mobile={{ col: 12 }}>
              <DescriptionTerm
                className="font-body-sm margin-bottom-0"
                term={modelToOperationsMiscT(
                  'modal.milestone.milestoneCategory.label'
                )}
              />
              <DescriptionDefinition
                className="font-body-md text-base-darkest"
                definition={
                  milestone.categories.category?.name || NoneSpecified
                }
              />
            </Grid>

            <Grid tablet={{ col: 6 }} mobile={{ col: 12 }}>
              <DescriptionTerm
                className="font-body-sm margin-bottom-0"
                term={modelToOperationsMiscT(
                  'modal.milestone.milestoneSubcategory.label'
                )}
              />
              <DescriptionDefinition
                className="font-body-md text-base-darkest"
                definition={
                  milestone.categories.subCategory?.name || NoneSpecified
                }
              />
            </Grid>
          </Grid>

          <Grid row className="margin-bottom-2">
            <Grid tablet={{ col: 12 }} mobile={{ col: 12 }}>
              <DescriptionTerm
                className="font-body-sm margin-bottom-0"
                term={mtoMilestoneT('responsibleComponent.label')}
              />
              <DescriptionDefinition
                className="font-body-md text-base-darkest"
                definition={
                  milestone.responsibleComponent.length > 0
                    ? milestone.responsibleComponent
                        .map(
                          (component: MtoMilestoneResponsibleComponent) =>
                            `${mtoMilestoneT(
                              `responsibleComponent.options.${component}`
                            )}`
                        )
                        .join(', ')
                    : NoneSpecified
                }
              />
            </Grid>
          </Grid>

          <Grid row className="margin-bottom-2">
            <Grid tablet={{ col: 12 }} mobile={{ col: 12 }}>
              <DescriptionTerm
                className="font-body-sm margin-bottom-0"
                term={mtoMilestoneT('facilitatedBy.label')}
              />
              <DescriptionDefinition
                className="font-body-md text-base-darkest"
                definition={
                  milestone.facilitatedBy
                    ? milestone.facilitatedBy
                        .map(
                          (facilitator: any) =>
                            `${mtoMilestoneT(
                              `facilitatedBy.options.${facilitator}`
                            )}${facilitator === 'OTHER' ? ` (${milestone.facilitatedByOther})` : ''}`
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
                term={mtoMilestoneT('needBy.label')}
              />
              <DescriptionDefinition
                className="font-body-md text-base-darkest"
                definition={milestone.needBy || NoneSpecified}
              />
            </Grid>
          </Grid>

          <Grid row className="margin-bottom-2">
            <Grid tablet={{ col: 6 }} mobile={{ col: 12 }}>
              <DescriptionTerm
                className="font-body-sm margin-bottom-0"
                term={
                  <>
                    {mtoMilestoneT('status.label')}
                    <Tooltip
                      wrapperclasses="top-2px margin-left-1"
                      label={stausConfig.questionTooltip}
                      position="right"
                    >
                      <Icon.Info
                        className="text-base-light"
                        aria-label="info"
                      />
                    </Tooltip>
                  </>
                }
              />
              <DescriptionDefinition
                className="font-body-md text-base-darkest"
                definition={
                  <MilestoneStatusTag
                    status={milestone.status}
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
                    {mtoMilestoneT('riskIndicator.label')}
                    <Tooltip
                      wrapperclasses="top-2px margin-left-1"
                      label={riskIndicatorConfig.questionTooltip}
                      position="right"
                    >
                      <Icon.Info
                        className="text-base-light"
                        aria-label="info"
                      />
                    </Tooltip>
                  </>
                }
              />

              <DescriptionDefinition
                className="font-body-md text-base-darkest"
                definition={
                  <div className="display-flex flex-align-end">
                    <div className="margin-right-1">
                      {riskIndicatorConfig.options[milestone.riskIndicator]}
                    </div>
                    <MTORiskIndicatorTag
                      riskIndicator={milestone.riskIndicator}
                      showTooltip
                    />
                  </div>
                }
              />
            </Grid>
          </Grid>
        </div>

        <h3 className="margin-bottom-1">
          {modelToOperationsMiscT('modal.editMilestone.selectedSolutionCount', {
            count: milestone.solutions.length
          })}
        </h3>

        {milestone.solutions.length > 0 ? (
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
                          {column.render('Header') as React.ReactElement}
                          {column.canSort && getHeaderSortIcon(column, false)}
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
                            {cell.render('Cell') as React.ReactElement}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </UswdsTable>

            {milestone.solutions.length > 5 && (
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
            {modelToOperationsMiscT('modal.editMilestone.noSolutionsTable')}
          </Alert>
        )}
        <div className="border-top-1px border-base-lighter padding-y-4 margin-top-6">
          <MilestoneNotes
            milestoneID={milestone.id}
            milestoneNotes={sortedMilestoneNotes}
            setMilestoneNotes={() => {}}
            selectedMilestoneNote={null}
            setSelectedMilestoneNote={() => {}}
            readView
          />
        </div>
      </div>
    </>
  );
};

export default MilestonePanel;
