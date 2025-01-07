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
import FieldErrorMsg from 'components/FieldErrorMsg';
import HelpText from 'components/HelpText';
import Modal from 'components/Modal';
import MultiSelect from 'components/MultiSelect';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Sidepanel from 'components/Sidepanel';
import TablePagination from 'components/TablePagination';
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

import LinkSolutionForm from '../LinkSolutionForm';
import MilestoneStatusTag from '../MTOStatusTag';

import './index.scss';
import '../../index.scss';

export type SolutionType = GetMtoMilestoneQuery['mtoMilestone']['solutions'][0];

type FormValues = {
  isDraft: boolean;
  name: string;
  categories: {
    category: {
      id: string;
    };
    subCategory: {
      id: string;
    };
  };
  facilitatedBy?: MtoFacilitator[];
  needBy?: string;
  status: MtoMilestoneStatus;
  riskIndicator: MtoRiskIndicator;
};

type TableSolutionType = {
  name: string;
  status: MtoSolutionStatus;
  riskIndicator: MtoRiskIndicator;
};

type EditMilestoneFormProps = {
  closeModal: () => void;
  setIsDirty: (isDirty: boolean) => void; // Set dirty state of form so parent can render modal for leaving with unsaved changes
  submitted: { current: boolean }; // Ref to track if form has been submitted
};

const EditMilestoneForm = ({
  closeModal,
  setIsDirty,
  submitted
}: EditMilestoneFormProps) => {
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

  const { modelID } = useParams<{ modelID: string }>();

  const params = new URLSearchParams(history.location.search);

  const editMilestoneID = params.get('edit-milestone');

  const [mutationError, setMutationError] = useState<React.ReactNode | null>();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [unsavedChanges, setUnsavedChanges] = useState<number>(0);

  const [unsavedSolutionChanges, setUnsavedSolutionChanges] =
    useState<number>(0);

  const { showMessage } = useMessage();

  const [editSolutionsOpen, setEditSolutionsOpen] = useState<boolean>(false);

  const {
    data,
    loading,
    error: queryError
  } = useGetMtoMilestoneQuery({
    variables: {
      id: editMilestoneID || ''
    }
  });

  const milestone = useMemo(() => {
    return data?.mtoMilestone;
  }, [data]);

  const { data: allSolutionData } = useGetMtoAllSolutionsQuery({
    variables: {
      id: modelID
    }
  });

  // Extracts all solutions from the query
  const allSolutions = useMemo(() => {
    return (
      allSolutionData?.modelPlan.mtoMatrix || {
        __typename: 'ModelsToOperationMatrix',
        commonSolutions: [],
        solutions: []
      }
    );
  }, [allSolutionData]);

  // Combine all solutions from both custom and common solutions
  const combinedSolutions = useMemo(
    () => [
      ...allSolutions?.solutions,
      ...(allSolutions?.commonSolutions as MtoSolution[])
    ],
    [allSolutions]
  );

  const isCustomSolution = useCallback(
    (id: string) => {
      return combinedSolutions.find(solution => solution.id === id);
    },
    [combinedSolutions]
  );

  // Format solution for table from either a MtoCommonSolutionKey or an UUID or SolutionType
  const formatSolutionForTable = useCallback(
    (
      solution: SolutionType | MtoCommonSolutionKey | string
    ): TableSolutionType => {
      if (typeof solution === 'string') {
        return {
          name: isCustomSolution(solution)
            ? combinedSolutions.find(sol => sol.id === solution)?.name || ''
            : combinedSolutions.find(sol => sol.key === solution)?.name || '',
          status: MtoSolutionStatus.NOT_STARTED,
          riskIndicator: MtoRiskIndicator.ON_TRACK
        };
      }

      return {
        name: solution.name || '',
        status: solution.status,
        riskIndicator: solution.riskIndicator || MtoRiskIndicator.ON_TRACK
      };
    },
    [combinedSolutions, isCustomSolution]
  );

  // Common solution state
  const [commonSolutionKeys, setCommonSolutionKeys] = useState<
    MtoCommonSolutionKey[]
  >(
    data?.mtoMilestone.solutions
      .filter(solution => !!solution.key)
      .map(solution => solution.key!) || []
  );

  // Common solution initial state
  const [commonSolutionKeysInitial, setCommonSolutionKeysInitial] = useState<
    MtoCommonSolutionKey[]
  >(
    data?.mtoMilestone.solutions
      .filter(solution => !!solution.key)
      .map(solution => solution.key!) || []
  );

  // Sets initial solution IDs from milestone from async data
  useEffect(() => {
    setCommonSolutionKeys(
      data?.mtoMilestone.solutions
        .filter(solution => !!solution.key)
        .map(solution => solution.key!) || []
    );
    setCommonSolutionKeysInitial(
      data?.mtoMilestone.solutions
        .filter(solution => !!solution.key)
        .map(solution => solution.key!) || []
    );
  }, [data]);

  // Custom solution state
  const [solutionIDs, setSolutionIDs] = useState<string[]>(
    data?.mtoMilestone.solutions
      .filter(solution => !solution.key)
      .map(solution => solution.id) || []
  );

  // Custom solution initial state
  const [solutionIDsInitial, setSolutionIDsInitial] = useState<string[]>(
    data?.mtoMilestone.solutions
      .filter(solution => !solution.key)
      .map(solution => solution.id) || []
  );

  // Sets initial solution IDs from milestone from async data
  useEffect(() => {
    setSolutionIDs(
      data?.mtoMilestone.solutions
        .filter(solution => !solution.key)
        .map(solution => solution.id) || []
    );
    setSolutionIDsInitial(
      data?.mtoMilestone.solutions
        .filter(solution => !solution.key)
        .map(solution => solution.id) || []
    );
  }, [data]);

  // Table state
  const [selectedSolutions, setSelectedSolutions] = useState<
    TableSolutionType[]
  >([
    ...solutionIDs.map(solution => formatSolutionForTable(solution)),
    ...commonSolutionKeys.map(solution => formatSolutionForTable(solution))
  ]);

  // Updates table data when solutions are added or removed
  useEffect(() => {
    const formattedCustomSolutions = solutionIDs.map(solution =>
      formatSolutionForTable(solution)
    );

    const formattedCommonSolutions = commonSolutionKeys.map(solution =>
      formatSolutionForTable(solution)
    );

    setSelectedSolutions([
      ...formattedCustomSolutions,
      ...formattedCommonSolutions
    ]);
  }, [data, solutionIDs, commonSolutionKeys, formatSolutionForTable]);

  // Set default values for form
  const formValues = useMemo(
    () => ({
      categories: {
        category: {
          id: milestone?.categories.category.id || 'default'
        },
        subCategory: {
          id: milestone?.categories.subCategory.id || 'default'
        }
      },
      name: milestone?.name || '',
      facilitatedBy: milestone?.facilitatedBy || [],
      needBy: milestone?.needBy || '',
      status: milestone?.status || MtoMilestoneStatus.NOT_STARTED,
      riskIndicator: milestone?.riskIndicator || MtoRiskIndicator.ON_TRACK,
      isDraft: milestone?.isDraft || false
    }),
    [milestone]
  );

  const methods = useForm<FormValues>({
    defaultValues: formValues,
    values: formValues
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting, isDirty, dirtyFields, touchedFields }
  } = methods;

  const values = watch();

  // Hacky hook to reset form values after loading due to DatePicker needing to use the onchange handler to update the default value
  // This is needed to prevent the form from being dirty on load
  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        reset(formValues);
      }, 0);
    }
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Needed to address bug in datepicker that counts async default needBy as a change and affecting dirty count
  useEffect(() => {
    const fieldsToCountSaved = { ...dirtyFields };

    // Flatten categories to accurately count keys of dirty fields
    const { categories, ...dirt } = fieldsToCountSaved;

    // Flatten categories to accurately count keys of dirty fields
    const flattenedDir = {
      ...dirt,
      ...(categories?.category && { categories: categories?.category }),
      ...(categories?.subCategory && { subCategory: categories?.subCategory })
    };

    const { facilitatedBy, ...rest } = flattenedDir;

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

    setIsDirty(!!totalChanges);
  }, [
    dirtyFields,
    touchedFields.needBy,
    values,
    setIsDirty,
    formValues.needBy,
    formValues.facilitatedBy.length
  ]);

  useEffect(() => {
    const solutionIDDifferenceCount = symmetricDifference(
      solutionIDs,
      solutionIDsInitial
    ).length;

    const commonSolutionKeysDifferenceCount = symmetricDifference(
      commonSolutionKeys,
      commonSolutionKeysInitial
    ).length;

    setUnsavedSolutionChanges(
      solutionIDDifferenceCount + commonSolutionKeysDifferenceCount
    );
  }, [
    solutionIDs,
    solutionIDsInitial,
    commonSolutionKeys,
    commonSolutionKeysInitial
  ]);

  const {
    selectOptionsAndMappedCategories,
    mappedSubcategories,
    selectOptions
  } = useFormatMTOCategories({
    modelID,
    primaryCategory: watch('categories.category.id'),
    hideUncategorized: false
  });

  const [updateMilestone] = useUpdateMtoMilestoneMutation({
    refetchQueries: [
      {
        query: GetModelToOperationsMatrixDocument,
        variables: {
          id: modelID
        }
      }
    ]
  });

  const [deleteMilestone] = useDeleteMtoMilestoneMutation();

  const onSubmit: SubmitHandler<FormValues> = formData => {
    let mtoCategoryID;

    const uncategorizedCategoryID = '00000000-0000-0000-0000-000000000000';

    // Sets the mtoCategoryID based on the change of either category or subcategory
    if (formData.categories.subCategory.id !== uncategorizedCategoryID) {
      mtoCategoryID = formData.categories.subCategory.id;
    } else if (formData.categories.category.id === uncategorizedCategoryID) {
      mtoCategoryID = null;
    } else {
      mtoCategoryID = formData.categories.category.id;
    }

    const { categories, needBy, name, ...formChanges } = dirtyInput(
      milestone,
      formData
    );

    // Check if category has changed to determine if the category is dirty to add to payload
    let isCategoryDirty: boolean = false;
    if (
      formData.categories.category.id !== milestone?.categories.category.id ||
      formData.categories.subCategory.id !==
        milestone?.categories.subCategory.id
    ) {
      isCategoryDirty = true;
    }

    updateMilestone({
      variables: {
        id: editMilestoneID || '',
        changes: {
          ...formChanges,
          ...(isCategoryDirty && { mtoCategoryID }),
          ...(!!needBy && { needBy: new Date(needBy)?.toISOString() }),
          ...(!!name && !milestone?.addedFromMilestoneLibrary && { name })
        },
        solutionLinks: {
          commonSolutionKeys,
          solutionIDs
        }
      }
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
                      'modal.editMilestone.successUpdated'
                    )}
                    components={{
                      b: <span className="text-bold" />
                    }}
                    values={{ milestone: formData.name }}
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
            {modelToOperationsMiscT('modal.editMilestone.errorUpdated')}
          </Alert>
        );
      });
  };

  const handleRemove = () => {
    deleteMilestone({
      variables: {
        id: editMilestoneID || ''
      },
      refetchQueries: [
        {
          query: GetModelToOperationsMatrixDocument,
          variables: {
            id: modelID
          }
        }
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
                {modelToOperationsMiscT('modal.editMilestone.successRemoved', {
                  milestone: milestone?.name
                })}
              </Alert>
            </>
          );
          setIsModalOpen(false);
        }
      })
      .catch(errors => {
        setMutationError(
          <Alert
            type="error"
            slim
            data-testid="error-alert"
            className="margin-y-4"
          >
            {modelToOperationsMiscT('modal.editMilestone.errorRemoved')}
          </Alert>
        );
        setIsModalOpen(false);
      });
  };

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
        Cell: ({ row }: { row: Row<SolutionType> }) => {
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
      data: selectedSolutions,
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
          {modelToOperationsMiscT('modal.editMilestone.areYouSure')}
        </PageHeading>

        <p className="margin-top-2 margin-bottom-3">
          {modelToOperationsMiscT('modal.editMilestone.removeDescription')}
        </p>

        <Button
          type="button"
          className="margin-right-4 bg-error"
          onClick={() => handleRemove()}
        >
          {modelToOperationsMiscT('modal.editMilestone.removeMilestone')}
        </Button>

        <Button type="button" unstyled onClick={() => setIsModalOpen(false)}>
          {modelToOperationsMiscT('modal.editMilestone.goBack')}
        </Button>
      </Modal>

      {milestone && (
        <Sidepanel
          isOpen={editSolutionsOpen}
          ariaLabel="Edit Solutions"
          testid="edit-solutions-sidepanel"
          modalHeading="Edit Solutions"
          backButton
          showScroll
          closeModal={() => {
            setEditSolutionsOpen(false);
          }}
          overlayClassName="bg-transparent"
        >
          <LinkSolutionForm
            milestone={milestone}
            closeModal={setEditSolutionsOpen}
            commonSolutionKeys={commonSolutionKeys}
            setCommonSolutionKeys={setCommonSolutionKeys}
            solutionIDs={solutionIDs}
            setSolutionIDs={setSolutionIDs}
            allSolutions={
              allSolutions as GetMtoAllSolutionsQuery['modelPlan']['mtoMatrix']
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
              {modelToOperationsMiscT('modal.editMilestone.unsavedChanges', {
                count: unsavedChanges + unsavedSolutionChanges
              })}
            </p>
            -
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || !isDirty}
              className="margin-x-1"
              unstyled
            >
              {modelToOperationsMiscT('modal.editMilestone.save')}
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
            {milestone.isDraft && (
              <span className="padding-right-1 model-to-operations__is-draft-tag padding-y-05 margin-right-2">
                <Icon.Science
                  className="margin-left-1"
                  style={{ top: '2px' }}
                />{' '}
                {modelToOperationsMiscT('milestoneLibrary.isDraft')}
              </span>
            )}

            {!milestone.addedFromMilestoneLibrary && (
              <span className="padding-right-1 model-to-operations__custom-tag padding-y-05">
                <Icon.Construction
                  className="margin-left-1"
                  style={{ top: '2px' }}
                />{' '}
                {modelToOperationsMiscT('modal.editMilestone.custom')}
              </span>
            )}

            {mutationError && mutationError}

            <FormProvider {...methods}>
              <Form
                className="maxw-none"
                id="edit-milestone-form"
                onSubmit={handleSubmit(onSubmit)}
              >
                <ConfirmLeaveRHF />

                <h2 className="margin-y-2 margin-bottom-4 padding-bottom-4 line-height-large border-bottom-1px border-base-lighter">
                  {milestone.name}
                </h2>

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

                  {!milestone.addedFromMilestoneLibrary && (
                    <Controller
                      name="name"
                      control={control}
                      rules={{
                        required: modelToOperationsMiscT('validation.fillOut')
                      }}
                      render={({
                        field: { ref, ...field },
                        fieldState: { error }
                      }) => (
                        <FormGroup className="margin-bottom-3">
                          <Label requiredMarker htmlFor="name">
                            {mtoMilestoneT('name.label')}
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
                    name="isDraft"
                    control={control}
                    rules={{
                      required: true
                    }}
                    render={({ field: { ref, ...field } }) => (
                      <FormGroup className="margin-top-0 margin-bottom-3">
                        <CheckboxField
                          {...field}
                          id={field.name}
                          value={field.name}
                          checked={field.value}
                          label={mtoMilestoneT('isDraft.label')}
                          subLabel={mtoMilestoneT('isDraft.sublabel')}
                        />
                      </FormGroup>
                    )}
                  />

                  <Controller
                    name="categories.category.id"
                    control={control}
                    rules={{
                      required: modelToOperationsMiscT('validation.fillOut'),
                      validate: value =>
                        value !== 'default' ||
                        modelToOperationsMiscT('validation.fillOut')
                    }}
                    render={({
                      field: { ref, ...field },
                      fieldState: { error }
                    }) => (
                      <FormGroup
                        error={!!error}
                        className="margin-top-0 margin-bottom-3"
                      >
                        <Label
                          htmlFor={convertCamelCaseToKebabCase(field.name)}
                          className="maxw-none text-bold"
                          requiredMarker
                        >
                          {modelToOperationsMiscT(
                            'modal.milestone.milestoneCategory.label'
                          )}
                        </Label>

                        <HelpText className="margin-top-05">
                          {modelToOperationsMiscT(
                            'modal.milestone.milestoneCategory.sublabel'
                          )}
                        </HelpText>

                        {!!error && (
                          <FieldErrorMsg>{error.message}</FieldErrorMsg>
                        )}

                        <Select
                          {...field}
                          id={convertCamelCaseToKebabCase(field.name)}
                          value={field.value || 'default'}
                          defaultValue="default"
                          onChange={e => {
                            field.onChange(e);
                            // Reset subcategory when category changes
                            setValue('categories.subCategory.id', 'default');
                          }}
                        >
                          {selectOptionsAndMappedCategories.map(option => {
                            return (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            );
                          })}
                        </Select>
                      </FormGroup>
                    )}
                  />

                  <Controller
                    name="categories.subCategory.id"
                    control={control}
                    rules={{
                      required: modelToOperationsMiscT('validation.fillOut'),
                      validate: value =>
                        value !== 'default' ||
                        modelToOperationsMiscT('validation.fillOut')
                    }}
                    render={({
                      field: { ref, ...field },
                      fieldState: { error }
                    }) => (
                      <FormGroup
                        error={!!error}
                        className="margin-top-0 margin-bottom-3"
                      >
                        <Label
                          htmlFor={convertCamelCaseToKebabCase(field.name)}
                          className="maxw-none text-bold"
                          requiredMarker
                        >
                          {modelToOperationsMiscT(
                            'modal.milestone.milestoneSubcategory.label'
                          )}
                        </Label>

                        <HelpText className="margin-top-05">
                          {modelToOperationsMiscT(
                            'modal.milestone.milestoneSubcategory.sublabel'
                          )}
                        </HelpText>

                        {!!error && (
                          <FieldErrorMsg>{error.message}</FieldErrorMsg>
                        )}

                        <Select
                          {...field}
                          id={convertCamelCaseToKebabCase(field.name)}
                          value={field.value || 'default'}
                          defaultValue="default"
                          disabled={
                            watch('categories.category.id') === 'default'
                          }
                        >
                          {[selectOptions[0], ...mappedSubcategories].map(
                            option => {
                              return (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              );
                            }
                          )}
                        </Select>
                      </FormGroup>
                    )}
                  />

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
                    name="needBy"
                    control={control}
                    render={({ field: { ref, ...field } }) => (
                      <FormGroup className="margin-0 margin-bottom-3">
                        <Label htmlFor={convertCamelCaseToKebabCase('needBy')}>
                          {mtoMilestoneT('needBy.label')}
                        </Label>

                        <HelpText className="margin-top-1">
                          {mtoMilestoneT('needBy.sublabel')}
                        </HelpText>

                        <div className="position-relative">
                          <DatePickerFormatted
                            {...field}
                            aria-labelledby={convertCamelCaseToKebabCase(
                              'needBy'
                            )}
                            id="milestone-need-by"
                            defaultValue={field.value}
                          />

                          {isDateInPast(watch('needBy')) && (
                            <DatePickerWarning
                              label={generalT('dateWarning')}
                            />
                          )}
                        </div>

                        {isDateInPast(watch('needBy')) && (
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
                          {mtoMilestoneT('status.label')}
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
                          {mtoMilestoneT('riskIndicator.label')}
                        </Label>

                        <HelpText className="margin-top-1">
                          {mtoMilestoneT('riskIndicator.sublabel')}
                        </HelpText>

                        {getKeys(riskIndicatorConfig.options).map(value => (
                          <Radio
                            {...field}
                            key={value}
                            id={`${convertCamelCaseToKebabCase(field.name)}-${value}`}
                            value={value}
                            label={riskIndicatorConfig.options[value]}
                            checked={field.value === value}
                          />
                        ))}
                      </FormGroup>
                    )}
                  />

                  <div className="border-top-1px border-base-lighter padding-y-4">
                    <h3 className="margin-0 margin-bottom-1">
                      {modelToOperationsMiscT(
                        'modal.editMilestone.selectedSolutions'
                      )}
                    </h3>

                    <p className="margin-0 margin-bottom-1">
                      {modelToOperationsMiscT(
                        'modal.editMilestone.selectedSolutionsCount',
                        {
                          count: selectedSolutions?.length || 0
                        }
                      )}
                    </p>

                    <Button
                      type="button"
                      onClick={() => {
                        // params.set('select-solutions', 'true');
                        // history.push({ search: params.toString() });
                        setEditSolutionsOpen(true);
                      }}
                      unstyled
                      className="margin-0 display-flex"
                    >
                      {modelToOperationsMiscT(
                        'modal.editMilestone.editSolutions'
                      )}
                      <Icon.ArrowForward className="top-2px" />
                    </Button>

                    {selectedSolutions.length === 0 ? (
                      <Alert type="info" slim>
                        {modelToOperationsMiscT(
                          'modal.editMilestone.noSolutions'
                        )}
                      </Alert>
                    ) : (
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
                                      width:
                                        column.id === 'status'
                                          ? '150px'
                                          : 'auto'
                                    }}
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

                        {selectedSolutions.length > 5 && (
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
                    {modelToOperationsMiscT('modal.editMilestone.saveChanges')}
                  </Button>

                  <Button
                    type="button"
                    disabled={isSubmitting}
                    className="bg-error"
                    onClick={() => setIsModalOpen(true)}
                  >
                    {modelToOperationsMiscT(
                      'modal.editMilestone.removeMilestone'
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

export default EditMilestoneForm;
