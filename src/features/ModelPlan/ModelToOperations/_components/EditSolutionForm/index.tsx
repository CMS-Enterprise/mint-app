import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { helpSolutions } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import {
  GetModelToOperationsMatrixDocument,
  GetMtoAllMilestonesQuery,
  GetMtoSolutionsAndMilestonesDocument,
  MtoFacilitator,
  MtoRiskIndicator,
  MtoSolutionStatus,
  useDeleteMtoSolutionMutation,
  useGetMtoAllMilestonesQuery,
  useGetMtoSolutionQuery,
  useUpdateMtoSolutionMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import ConfirmLeaveRHF from 'components/ConfirmLeave/ConfirmLeaveRHF';
import DatePickerFormatted from 'components/DatePickerFormatted';
import DatePickerWarning from 'components/DatePickerWarning';
import FieldErrorMsg from 'components/FieldErrorMsg';
import HelpText from 'components/HelpText';
import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import MultiSelect from 'components/MultiSelect';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Sidepanel from 'components/Sidepanel';
import TablePagination from 'components/TablePagination';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
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

import ImplementationStatuses from '../ImplementationStatus';
import LinkMilestoneForm from '../LinkMilestoneForm';
import { MilestoneType } from '../MatrixTable/columns';
import MilestoneStatusTag from '../MTOStatusTag';

import '../../index.scss';

// export type SolutionType = GetMtoMilestoneQuery['mtoMilestone']['solutions'][0];

type FormValues = {
  name: string;
  facilitatedBy?: MtoFacilitator[];
  neededBy?: string;
  status: MtoSolutionStatus;
  riskIndicator: MtoRiskIndicator;
};

type TableMilestoneType =
  GetMtoAllMilestonesQuery['modelPlan']['mtoMatrix']['milestones'][number];

type EditSolutionFormProps = {
  closeModal: () => void;
  setIsDirty: (isDirty: boolean) => void; // Set dirty state of form so parent can render modal for leaving with unsaved changes
  submitted: { current: boolean }; // Ref to track if form has been submitted
};

const EditSolutionForm = ({
  closeModal,
  setIsDirty,
  submitted
}: EditSolutionFormProps) => {
  const { t: mtoSolutionT } = useTranslation('mtoSolution');
  const { t: modelToOperationsMiscT } = useTranslation('modelToOperationsMisc');
  const { t: generalT } = useTranslation('general');

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');
  const isMobile = useCheckResponsiveScreen('mobile', 'smaller');

  const {
    facilitatedBy: facilitatedByConfig,
    status: stausConfig,
    riskIndicator: riskIndicatorConfig
  } = usePlanTranslation('mtoSolution');

  const history = useHistory();

  const { modelID } = useParams<{ modelID: string }>();

  const params = new URLSearchParams(history.location.search);

  const editSolutionID = params.get('edit-solution');

  const shouldScrollToBottom = params.get('scroll-to-bottom') === 'true';
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [mutationError, setMutationError] = useState<React.ReactNode | null>();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [unsavedChanges, setUnsavedChanges] = useState<number>(0);

  const [unsavedSolutionChanges, setUnsavedSolutionChanges] =
    useState<number>(0);

  const { showMessage } = useMessage();

  const [editMilestonesOpen, setEditMilestonesOpen] = useState<boolean>(false);

  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [shouldScrollToBottom]);

  const {
    data,
    loading,
    error: queryError
  } = useGetMtoSolutionQuery({
    variables: {
      id: editSolutionID || ''
    },
    skip: !editSolutionID
  });

  const solution = useMemo(() => {
    return data?.mtoSolution;
  }, [data]);

  const solutionRoute: string | undefined = helpSolutions.find(
    sol => sol.enum === solution?.key
  )?.route;

  const { data: allMilestoneData } = useGetMtoAllMilestonesQuery({
    variables: {
      id: modelID
    }
  });

  // Gets all existing milestones from the MTO matrix
  // This is used to populate the milestone select options and map to milestones that are associated to the solution
  const allMilestones = useMemo(() => {
    return (
      allMilestoneData?.modelPlan.mtoMatrix || {
        __typename: 'ModelsToOperationMatrix',
        commonMilestones: [],
        milestones: []
      }
    );
  }, [allMilestoneData]);

  // Milestone list of IDs state
  const [milestoneIDs, setMilestoneIDs] = useState<string[]>(
    data?.mtoSolution.milestones.map(milestone => milestone.id) || []
  );

  // Milestone IDs input mutation initial state - used to calculate amount of changed milestones
  const [milestoneIDsInitial, setMilestoneIDsInitial] = useState<string[]>(
    data?.mtoSolution.milestones.map(milestone => milestone.id) || []
  );

  // Sets initial milestone IDs from solution from async data
  useEffect(() => {
    setMilestoneIDs(
      data?.mtoSolution.milestones.map(milestone => milestone.id) || []
    );
    setMilestoneIDsInitial(
      data?.mtoSolution.milestones.map(milestone => milestone.id) || []
    );
  }, [data]);

  // Sets the inital milestones that exist for the solution
  const initialMilestones = useMemo(
    () =>
      allMilestones.milestones.filter(milestone =>
        milestoneIDs.includes(milestone.id)
      ) || [],
    [allMilestones.milestones, milestoneIDs]
  );

  // Sets the table milestones to the initial milestones
  const [tableMilestones, setTableMilestones] =
    useState<TableMilestoneType[]>(initialMilestones);

  // Updates the table items after the linking milestone modal is closed
  useEffect(() => {
    const updatedMilestones = allMilestones.milestones.filter(milestone =>
      milestoneIDs.includes(milestone.id)
    );

    setTableMilestones(updatedMilestones);
  }, [allMilestones.milestones, milestoneIDs]);

  // Set default values for form
  const formValues = useMemo(
    () => ({
      name: solution?.name || '',
      facilitatedBy: solution?.facilitatedBy || [],
      neededBy: solution?.neededBy || '',
      status: solution?.status || MtoSolutionStatus.NOT_STARTED,
      riskIndicator: solution?.riskIndicator || MtoRiskIndicator.ON_TRACK
    }),
    [solution]
  );

  const methods = useForm<FormValues>({
    defaultValues: formValues,
    values: formValues
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting, isDirty, dirtyFields, touchedFields }
  } = methods;

  const values = watch();

  // Needed to address bug in datepicker that counts async default neededBy as a change and affecting dirty count
  useEffect(() => {
    const { facilitatedBy, ...rest } = { ...dirtyFields };

    // Counts amount of changes in facilitatedBy array
    let facilitatedByChangeCount: number = 0;
    if (facilitatedBy) {
      facilitatedByChangeCount = Math.abs(
        (values.facilitatedBy?.length || 0) -
          (formValues.facilitatedBy.length || 0)
      );
    }

    const totalChanges = facilitatedByChangeCount + Object.keys(rest).length;

    setUnsavedChanges(totalChanges);
  }, [
    dirtyFields,
    touchedFields.neededBy,
    values,
    formValues.neededBy,
    formValues.facilitatedBy.length
  ]);

  // Set's the unsaved changes to state based on symmettrical difference/ change is counted if removed, added, or replaced in array
  useEffect(() => {
    const milestoneIDDifferenceCount = symmetricDifference(
      milestoneIDs,
      milestoneIDsInitial
    ).length;

    setUnsavedSolutionChanges(milestoneIDDifferenceCount);
  }, [milestoneIDs, milestoneIDsInitial]);

  // Sets dirty state based on changes in form to render the leave confirmation modal
  useEffect(() => {
    if (!!unsavedChanges || !!unsavedSolutionChanges) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [unsavedChanges, unsavedSolutionChanges, setIsDirty]);

  const [updateSolution] = useUpdateMtoSolutionMutation();

  const [deleteSolution] = useDeleteMtoSolutionMutation();

  const onSubmit: SubmitHandler<FormValues> = formData => {
    const { neededBy, name, ...formChanges } = dirtyInput(solution, formData);

    updateSolution({
      variables: {
        id: editSolutionID || '',
        changes: {
          ...formChanges,
          ...(!!neededBy && { neededBy: new Date(neededBy)?.toISOString() }),
          ...(!!name && !solution?.addedFromSolutionLibrary && { name })
        },
        milestoneLinks: {
          milestoneIDs
        }
      },
      refetchQueries: [
        GetModelToOperationsMatrixDocument,
        GetMtoSolutionsAndMilestonesDocument
      ]
    })
      .then(response => {
        if (!response?.errors) {
          showMessage(
            <>
              <Alert
                type="success"
                slim
                data-testid="mandatory-fields-alert"
                className="margin-y-4"
              >
                <span className="mandatory-fields-alert__text">
                  <Trans
                    i18nKey={modelToOperationsMiscT(
                      'modal.editSolution.successUpdated'
                    )}
                    components={{
                      b: <span className="text-bold" />
                    }}
                    values={{ solution: formData.name }}
                  />
                </span>
              </Alert>
            </>
          );
          // eslint-disable-next-line no-param-reassign
          submitted.current = true;
          setIsDirty(false);
          closeModal();
        }
      })
      .catch(() => {
        setMutationError(
          <Alert
            type="error"
            slim
            data-testid="error-alert"
            className="margin-y-4"
          >
            {modelToOperationsMiscT('modal.editSolution.errorUpdated')}
          </Alert>
        );
      });
  };

  const handleRemove = () => {
    deleteSolution({
      variables: {
        id: editSolutionID || ''
      },
      refetchQueries: [GetModelToOperationsMatrixDocument]
    })
      .then(response => {
        if (!response?.errors) {
          showMessage(
            <>
              <Alert
                type="success"
                slim
                data-testid="mandatory-fields-alert"
                className="margin-y-4"
              >
                {modelToOperationsMiscT('modal.editSolution.successRemoved', {
                  solution: solution?.name
                })}
              </Alert>
            </>
          );
          // eslint-disable-next-line no-param-reassign
          submitted.current = true;
          setIsDirty(false);
          closeModal();
          setIsModalOpen(false);
        }
      })
      .catch(() => {
        setMutationError(
          <Alert
            type="error"
            slim
            data-testid="error-alert"
            className="margin-y-4"
          >
            {modelToOperationsMiscT('modal.editSolution.errorRemoved')}
          </Alert>
        );
        setIsModalOpen(false);
      });
  };

  const columns: Column<MilestoneType>[] = useMemo(
    () => [
      {
        Header: modelToOperationsMiscT('modal.editSolution.milestone'),
        accessor: 'name',
        width: 300
      },
      {
        Header: modelToOperationsMiscT('modal.editSolution.status'),
        accessor: 'status',
        width: 150,
        Cell: ({ row }: { row: Row<MilestoneType> }) => {
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
        width: 50,
        Cell: ({ row }: { row: Row<MilestoneType> }) => {
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
      data: tableMilestones,
      initialState: { pageIndex: 0, pageSize: 5 }
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  rows.map(row => prepareRow(row));

  if (loading && !solution) {
    return <PageLoading />;
  }

  if (!solution || queryError) {
    return null;
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        className="confirmation-modal"
      >
        <PageHeading
          headingLevel="h3"
          className="margin-top-neg-2 margin-bottom-1"
        >
          {modelToOperationsMiscT('modal.editSolution.areYouSure')}
        </PageHeading>

        <p className="margin-top-2 margin-bottom-3">
          {solution.addedFromSolutionLibrary
            ? modelToOperationsMiscT('modal.editSolution.removeDescription')
            : modelToOperationsMiscT(
                'modal.editSolution.removeCustomDescription'
              )}
        </p>

        <Button
          type="button"
          className="margin-right-4 bg-error"
          onClick={() => handleRemove()}
        >
          {modelToOperationsMiscT('modal.editSolution.removeSolution')}
        </Button>

        <Button type="button" unstyled onClick={() => setIsModalOpen(false)}>
          {modelToOperationsMiscT('modal.editSolution.goBack')}
        </Button>
      </Modal>

      {solution && (
        <Sidepanel
          isOpen={editMilestonesOpen}
          ariaLabel={modelToOperationsMiscT(
            'modal.editSolution.backToSolution'
          )}
          testid="edit-solutions-sidepanel"
          modalHeading={modelToOperationsMiscT(
            'modal.editSolution.backToSolution'
          )}
          backButton
          showScroll
          noScrollable={false}
          closeModal={() => {
            setEditMilestonesOpen(false);
          }}
          overlayClassName="bg-transparent"
        >
          <LinkMilestoneForm
            solution={solution}
            milestoneIDs={milestoneIDs}
            setMilestoneIDs={setMilestoneIDs}
            allMilestones={
              allMilestones as GetMtoAllMilestonesQuery['modelPlan']['mtoMatrix']
            }
          />
        </Sidepanel>
      )}

      {unsavedChanges + unsavedSolutionChanges > 0 && (
        <div
          className={classNames('save-tag', {
            'margin-top-4': isMobile
          })}
        >
          <div className="bg-warning-lighter padding-y-05 padding-x-1">
            <Icon.Warning className="margin-right-1 top-2px text-warning" />
            <p className="margin-0 display-inline margin-right-1">
              {modelToOperationsMiscT('modal.editSolution.unsavedChanges', {
                count: unsavedChanges + unsavedSolutionChanges
              })}
            </p>
            -
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={(isSubmitting || !isDirty) && !unsavedSolutionChanges}
              className="margin-x-1"
              unstyled
            >
              {modelToOperationsMiscT('modal.editSolution.save')}
            </Button>
          </div>
        </div>
      )}

      <GridContainer
        className={classNames({
          'padding-8': !isTablet,
          'padding-4': isTablet
        })}
      >
        <Grid row>
          <Grid col={10}>
            {!solution.addedFromSolutionLibrary && (
              <span className="padding-right-1 model-to-operations__custom-tag padding-y-05">
                <Icon.Construction
                  className="margin-left-1"
                  style={{ top: '2px' }}
                />{' '}
                {modelToOperationsMiscT('modal.editSolution.custom')}
              </span>
            )}

            {mutationError && mutationError}

            <FormProvider {...methods}>
              <Form
                className="maxw-none"
                id="edit-solution-form"
                onSubmit={handleSubmit(onSubmit)}
              >
                <ConfirmLeaveRHF />

                <div className="border-bottom-1px border-base-lighter padding-bottom-3 margin-bottom-3">
                  <h2
                    className={classNames(
                      'margin-y-2 margin-bottom-2 line-height-large',
                      {
                        'margin-top-0': solution.addedFromSolutionLibrary
                      }
                    )}
                  >
                    {solution.name}
                  </h2>

                  <p className="text-base margin-bottom-0">
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
                </div>

                <Fieldset disabled={loading}>
                  <p className="margin-top-0 margin-bottom-3 text-base">
                    <Trans
                      i18nKey={modelToOperationsMiscT(
                        'modal.allFieldsRequired'
                      )}
                      components={{
                        s: <span className="text-secondary-dark" />
                      }}
                    />
                  </p>

                  {!solution.addedFromSolutionLibrary && (
                    <Controller
                      name="name"
                      control={control}
                      rules={{
                        required: modelToOperationsMiscT('validation.fillOut'),
                        validate: value => {
                          const trimmedValue = value.trim();
                          if (!trimmedValue) {
                            return modelToOperationsMiscT('validation.fillOut');
                          }
                          return true;
                        }
                      }}
                      render={({
                        field: { ref, ...field },
                        fieldState: { error }
                      }) => (
                        <FormGroup className="margin-bottom-3">
                          <Label requiredMarker htmlFor="name">
                            {mtoSolutionT('name.label')}
                          </Label>

                          {!!error && (
                            <FieldErrorMsg>{error.message}</FieldErrorMsg>
                          )}

                          <TextInput
                            {...field}
                            ref={null}
                            id="name"
                            type="text"
                          />
                        </FormGroup>
                      )}
                    />
                  )}

                  <Controller
                    name="facilitatedBy"
                    control={control}
                    render={({ field: { ref, ...field } }) => (
                      <FormGroup className="margin-0 margin-bottom-3">
                        <Label
                          htmlFor={convertCamelCaseToKebabCase('facilitatedBy')}
                        >
                          {facilitatedByConfig.label}
                        </Label>

                        <HelpText className="margin-top-1">
                          {facilitatedByConfig.sublabel}
                        </HelpText>

                        <MultiSelect
                          {...field}
                          id={convertCamelCaseToKebabCase(
                            'multiSourceDataToCollect'
                          )}
                          inputId={convertCamelCaseToKebabCase('facilitatedBy')}
                          ariaLabel={convertCamelCaseToKebabCase(
                            'facilitatedBy'
                          )}
                          ariaLabelText={facilitatedByConfig.label}
                          options={composeMultiSelectOptions(
                            facilitatedByConfig.options
                          )}
                          selectedLabel={
                            facilitatedByConfig.multiSelectLabel || ''
                          }
                          initialValues={watch('facilitatedBy')}
                        />
                      </FormGroup>
                    )}
                  />

                  <Controller
                    name="neededBy"
                    control={control}
                    render={({ field: { ref, ...field } }) => (
                      <FormGroup className="margin-0 margin-bottom-3">
                        <Label
                          htmlFor={convertCamelCaseToKebabCase('neededBy')}
                        >
                          {mtoSolutionT('neededBy.label')}
                        </Label>

                        <HelpText className="margin-top-1">
                          {mtoSolutionT('neededBy.sublabel')}
                        </HelpText>

                        <div className="position-relative">
                          <DatePickerFormatted
                            {...field}
                            aria-labelledby={convertCamelCaseToKebabCase(
                              'neededBy'
                            )}
                            id="solution-needed-by"
                            defaultValue={field.value}
                            suppressMilliseconds
                          />

                          {isDateInPast(watch('neededBy')) && (
                            <DatePickerWarning
                              label={generalT('dateWarning')}
                            />
                          )}
                        </div>

                        {isDateInPast(watch('neededBy')) && (
                          <Alert
                            type="warning"
                            className="margin-top-2"
                            headingLevel="h4"
                            slim
                          >
                            {generalT('dateWarning')}
                          </Alert>
                        )}
                      </FormGroup>
                    )}
                  />

                  <Controller
                    name="status"
                    control={control}
                    rules={{
                      required: true
                    }}
                    render={({ field: { ref, ...field } }) => (
                      <FormGroup className="margin-top-0 margin-bottom-3">
                        <Label
                          htmlFor={convertCamelCaseToKebabCase(field.name)}
                          className="maxw-none text-bold"
                          requiredMarker
                        >
                          {mtoSolutionT('status.label')}
                        </Label>

                        <Select
                          {...field}
                          id={convertCamelCaseToKebabCase(field.name)}
                          value={field.value || ''}
                        >
                          {getKeys(stausConfig.options).map(option => {
                            return (
                              <option key={option} value={option}>
                                {stausConfig.options[option]}
                              </option>
                            );
                          })}
                        </Select>
                      </FormGroup>
                    )}
                  />

                  <ImplementationStatuses className="margin-bottom-4" />

                  <Controller
                    name="riskIndicator"
                    control={control}
                    rules={{
                      required: true
                    }}
                    render={({ field: { ref, ...field } }) => (
                      <FormGroup className="margin-top-0 margin-bottom-3">
                        <Label
                          htmlFor={convertCamelCaseToKebabCase(field.name)}
                          className="maxw-none text-bold"
                          requiredMarker
                        >
                          {mtoSolutionT('riskIndicator.label')}
                        </Label>

                        <HelpText className="margin-top-1">
                          {mtoSolutionT('riskIndicator.sublabel')}
                        </HelpText>

                        {getKeys(riskIndicatorConfig.options).map(value => (
                          <div className="display-flex" key={value}>
                            <Radio
                              {...field}
                              id={`${convertCamelCaseToKebabCase(field.name)}-${value}`}
                              value={value}
                              label={riskIndicatorConfig.options[value]}
                              checked={field.value === value}
                              className="margin-right-1"
                            />
                            {(() => {
                              if (value === MtoRiskIndicator.AT_RISK)
                                return (
                                  <Icon.Error
                                    className="text-error-dark"
                                    style={{ top: '10px' }}
                                    size={3}
                                  />
                                );

                              if (value === MtoRiskIndicator.OFF_TRACK)
                                return (
                                  <Icon.Warning
                                    className="text-warning-dark"
                                    style={{ top: '10px' }}
                                    size={3}
                                  />
                                );

                              return <></>;
                            })()}
                          </div>
                        ))}
                      </FormGroup>
                    )}
                  />

                  <div className="border-top-1px border-base-lighter padding-y-4">
                    <h3 className="margin-0 margin-bottom-1">
                      {modelToOperationsMiscT(
                        'modal.editSolution.selectedMilestones'
                      )}
                    </h3>

                    <p className="margin-0 margin-bottom-1">
                      {modelToOperationsMiscT(
                        'modal.editSolution.selectedMilestonesCount',
                        {
                          count: tableMilestones?.length || 0
                        }
                      )}
                    </p>

                    <Button
                      type="button"
                      onClick={() => {
                        setEditMilestonesOpen(true);
                      }}
                      unstyled
                      className="margin-0 display-flex"
                    >
                      {modelToOperationsMiscT(
                        'modal.editSolution.editMilestones'
                      )}
                      <Icon.ArrowForward className="top-2px" />
                    </Button>

                    {tableMilestones.length === 0 ? (
                      <Alert type="info" slim>
                        {modelToOperationsMiscT(
                          'modal.editSolution.noMilestones'
                        )}
                      </Alert>
                    ) : (
                      <div ref={scrollRef}>
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
                                key={
                                  { ...headerGroup.getHeaderGroupProps() }.key
                                }
                              >
                                {headerGroup.headers.map(column => (
                                  <th
                                    {...column.getHeaderProps()}
                                    scope="col"
                                    key={column.id}
                                    className="padding-left-0 padding-bottom-0"
                                    style={{
                                      width: column.width
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

                        {tableMilestones.length > 5 && (
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
                      </div>
                    )}
                  </div>
                </Fieldset>

                <div className="border-top-1px border-base-lighter padding-y-4">
                  <Button
                    type="submit"
                    disabled={
                      (isSubmitting || !isDirty) && !unsavedSolutionChanges
                    }
                    className="margin-bottom-2"
                  >
                    {modelToOperationsMiscT('modal.editSolution.saveChanges')}
                  </Button>

                  <Button
                    type="button"
                    disabled={isSubmitting}
                    className="bg-error"
                    onClick={() => setIsModalOpen(true)}
                  >
                    {modelToOperationsMiscT(
                      'modal.editSolution.removeSolution'
                    )}
                  </Button>
                </div>
              </Form>
            </FormProvider>
          </Grid>
        </Grid>
      </GridContainer>
    </>
  );
};

export default EditSolutionForm;
