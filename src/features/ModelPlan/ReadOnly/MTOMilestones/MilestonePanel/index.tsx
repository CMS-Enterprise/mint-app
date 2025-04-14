import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Column,
  Row,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import {
  Button,
  Fieldset,
  Form,
  FormGroup,
  Grid,
  GridContainer,
  Icon,
  Label,
  Radio,
  Select,
  Table as UswdsTable,
  TextInput
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import MTORiskIndicatorTag from 'features/ModelPlan/ModelToOperations/_components/MTORiskIndicatorIcon';
import MilestoneStatusTag from 'features/ModelPlan/ModelToOperations/_components/MTOStatusTag';
import {
  GetModelToOperationsMatrixDocument,
  GetMtoAllSolutionsQuery,
  GetMtoMilestoneQuery,
  MtoCommonSolutionKey,
  MtoFacilitator,
  MtoMilestoneStatus,
  MtoRiskIndicator,
  MtoSolution,
  MtoSolutionStatus,
  useDeleteMtoMilestoneMutation,
  useGetMtoAllSolutionsQuery,
  useGetMtoMilestoneQuery,
  useUpdateMtoMilestoneMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import ConfirmLeaveRHF from 'components/ConfirmLeave/ConfirmLeaveRHF';
import DatePickerFormatted from 'components/DatePickerFormatted';
import DatePickerWarning from 'components/DatePickerWarning';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/DescriptionGroup';
import FieldErrorMsg from 'components/FieldErrorMsg';
import HelpText from 'components/HelpText';
import Modal from 'components/Modal';
import MultiSelect from 'components/MultiSelect';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Sidepanel from 'components/Sidepanel';
import TablePagination from 'components/TablePagination';
import Tooltip from 'components/Tooltip';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import useFormatMTOCategories from 'hooks/useFormatMTOCategories';
import useMessage from 'hooks/useMessage';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import { isDateInPast } from 'utils/date';
import dirtyInput, { symmetricDifference } from 'utils/formUtil';
import {
  composeMultiSelectOptions,
  convertCamelCaseToKebabCase
} from 'utils/modelPlan';
import { getHeaderSortIcon } from 'utils/tableSort';

// import '../../index.scss';

export type SolutionType = GetMtoMilestoneQuery['mtoMilestone']['solutions'][0];

type EditMilestoneFormProps = {
  closeModal: () => void;
};

const MilestonePanel = ({ closeModal }: EditMilestoneFormProps) => {
  const { t: mtoMilestoneT } = useTranslation('mtoMilestone');
  const { t: modelToOperationsMiscT } = useTranslation('modelToOperationsMisc');
  const { t: generalT } = useTranslation('general');

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');
  const isMobile = useCheckResponsiveScreen('mobile', 'smaller');

  const {
    facilitatedBy: facilitatedByConfig,
    status: stausConfig,
    riskIndicator: riskIndicatorConfig
  } = usePlanTranslation('mtoMilestone');

  const history = useHistory();

  const params = new URLSearchParams(history.location.search);

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

  const milestone = useMemo(() => {
    return (
      data?.mtoMilestone ||
      ({
        __typename: 'MTOMilestone',
        id: '',
        name: '',
        status: MtoMilestoneStatus.NOT_STARTED,
        key: null,
        facilitatedBy: null,
        riskIndicator: MtoRiskIndicator.ON_TRACK,
        addedFromMilestoneLibrary: false,
        solutions: [],
        isDraft: false,
        categories:
          [] as unknown as GetMtoMilestoneQuery['mtoMilestone']['categories']
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
      <GridContainer
        className={classNames({
          'padding-8': !isTablet,
          'padding-4': isTablet
        })}
      >
        <Grid row>
          <Grid col={10}>
            <span className="padding-right-1 model-to-operations__is-draft-tag padding-y-05 margin-right-2">
              <Icon.Science className="margin-left-1" style={{ top: '2px' }} />{' '}
              {modelToOperationsMiscT('milestoneLibrary.isDraft')}
            </span>

            {!milestone.addedFromMilestoneLibrary && (
              <span className="padding-right-1 model-to-operations__custom-tag padding-y-05">
                <Icon.Construction
                  className="margin-left-1"
                  style={{ top: '2px' }}
                />{' '}
                {modelToOperationsMiscT('modal.editMilestone.custom')}
              </span>
            )}

            <h2>{milestone.name}</h2>

            <p className="margin-0 mint-body-normal text-base-dark">
              {modelToOperationsMiscT(
                'modal.editMilestone.readviewDescription'
              )}
            </p>

            <div className="border-base-light border-top-1px border-bottom-1px padding-y-3 margin-y-4">
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
                    term={mtoMilestoneT('facilitatedBy.label')}
                  />
                  <DescriptionDefinition
                    className="font-body-md text-base-darkest"
                    definition={
                      milestone.facilitatedBy
                        ? milestone.facilitatedBy
                            .map((facilitator: any) =>
                              mtoMilestoneT(
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
                          <Icon.Info className="text-base-light" />
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
              {modelToOperationsMiscT(
                'modal.editMilestone.selectedSolutionCount',
                {
                  count: milestone.solutions.length
                }
              )}
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
          </Grid>
        </Grid>
      </GridContainer>
    </>
  );
};

export default MilestonePanel;
