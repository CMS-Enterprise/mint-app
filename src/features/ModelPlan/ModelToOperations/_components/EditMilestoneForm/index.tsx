import React, { useEffect, useMemo, useState } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
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
  TextInput
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  GetModelToOperationsMatrixDocument,
  MtoFacilitator,
  MtoMilestoneStatus,
  MtoRiskIndicator,
  useDeleteMtoMilestoneMutation,
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
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import useFormatMTOCategories from 'hooks/useFormatMTOCategories';
import useMessage from 'hooks/useMessage';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import { isDateInPast } from 'utils/date';
import dirtyInput from 'utils/formUtil';
import {
  composeMultiSelectOptions,
  convertCamelCaseToKebabCase
} from 'utils/modelPlan';
import mtoMilestoneSchema from 'validations/mtoMilestoneSchema';

import './index.scss';
import '../../index.scss';

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

  const params = useMemo(
    () => new URLSearchParams(history.location.search),
    [history]
  );

  const editMilestoneID = params.get('edit-milestone');

  const [mutationError, setMutationError] = useState<React.ReactNode | null>();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [unsavedChanges, setUnsavedChanges] = useState<number>(0);

  const { showMessage } = useMessage();

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
    values: formValues,
    resolver: yupResolver(mtoMilestoneSchema)
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

  const {
    selectOptionsAndMappedCategories,
    mappedSubcategories,
    selectOptions
  } = useFormatMTOCategories({
    modelID,
    primaryCategory: watch('categories.category.id')
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

      {unsavedChanges > 0 && (
        <div
          className={classNames('save-tag', {
            'margin-top-4': isMobile
          })}
        >
          <div className="bg-warning-lighter padding-y-05 padding-x-1">
            <Icon.Warning className="margin-right-1 top-2px text-warning" />
            <p className="margin-0 display-inline margin-right-1">
              {modelToOperationsMiscT('modal.editMilestone.unsavedChanges', {
                count: unsavedChanges
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
                      required: true,
                      validate: value => value !== 'default'
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
                </Fieldset>

                <div className="border-top-1px border-base-lighter padding-y-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isDirty}
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
