import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Controller,
  Form,
  FormProvider,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  DatePicker,
  Fieldset,
  FormGroup,
  Grid,
  GridContainer,
  Icon,
  Label,
  Radio,
  Select
} from '@trussworks/react-uswds';
import { dir } from 'console';
import {
  GetModelToOperationsMatrixDocument,
  MtoFacilitator,
  MtoMilestoneStatus,
  MtoRiskIndicator,
  useDeleteMtoMilestoneMutation,
  useGetMtoMilestoneQuery,
  useUpdateMtoMilestoneMutation
} from 'gql/generated/graphql';
import i18next from 'i18next';
import * as Yup from 'yup';

import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import DatePickerFormatted from 'components/DatePickerFormatted';
import DatePickerWarning from 'components/DatePickerWarning';
import FieldErrorMsg from 'components/FieldErrorMsg';
import HelpText from 'components/HelpText';
import Modal from 'components/Modal';
import MultiSelect from 'components/MultiSelect';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
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

import './index.scss';
import '../../index.scss';

const milestoneSchema = Yup.object().shape({
  categories: Yup.object().shape({
    category: Yup.object().shape({
      id: Yup.string()
        .trim()
        .required()
        .notOneOf(
          ['default'],
          i18next.t('modelToOperationsMisc:validation.fillOut')
        )
    }),
    subCategory: Yup.object().shape({
      id: Yup.string()
        .trim()
        .required()
        .notOneOf(
          ['default'],
          i18next.t('modelToOperationsMisc:validation.fillOut')
        )
    })
  }),
  riskIndicator: Yup.string()
    .trim()
    .required(i18next.t('modelToOperationsMisc:validation.fillOut')),
  name: Yup.string(),
  needBy: Yup.string().nullable(),
  status: Yup.string()
    .trim()
    .required(i18next.t('modelToOperationsMisc:validation.fillOut')),
  facilitatedBy: Yup.array().of(Yup.string().trim()),
  isDraft: Yup.boolean()
});

type FormValues = {
  name: string;
  categories: {
    category: {
      id: string;
    };
    subCategory: {
      id: string;
    };
  };
  facilitatedBy: MtoFacilitator[];
  needBy: string;
  status: MtoMilestoneStatus;
  riskIndicator: MtoRiskIndicator;
  isDraft: boolean;
};

type EditMilestoneFormProps = {
  closeModal: () => void;
};

const EditMilestoneForm = ({ closeModal }: EditMilestoneFormProps) => {
  const { t: mtoMilestoneT } = useTranslation('mtoMilestone');
  const { t: modelToOperationsMiscT } = useTranslation('modelToOperationsMisc');
  const { t: generalT } = useTranslation('general');

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
    resolver: yupResolver(milestoneSchema)
  });

  const [unsavedChanges, setUnsavedChanges] = useState<number>(0);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, isDirty, dirtyFields, touchedFields }
  } = methods;

  const values = watch();

  // Needed to address bug in datepicker that counts async default needBy as a change and affecting dirty count
  useEffect(() => {
    const { needBy, ...rest } = dirtyFields;
    let fieldsToCountSaved = { ...rest };
    if (touchedFields.needBy) {
      fieldsToCountSaved = { ...dirtyFields };
    }
    // Flatten categories to accurately count keys of dirty fields
    const { categories, ...dirt } = fieldsToCountSaved;
    const flattenedDir = {
      ...dirt,
      ...(categories?.category && { categories: categories?.category }),
      ...(categories?.subCategory && { subCategory: categories?.subCategory })
    };
    setUnsavedChanges(Object.keys(flattenedDir).length);
  }, [dirtyFields, touchedFields.needBy, values]);

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
        <div className="save-tag">
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

      <GridContainer className="padding-8">
        <Grid row>
          <Grid col={10}>
            {!milestone.addedFromMilestoneLibrary && (
              <span className="padding-right-1 model-to-operations__milestone-tag padding-y-05">
                <Icon.LightbulbOutline
                  className="margin-left-1"
                  style={{ top: '2px' }}
                />{' '}
                {modelToOperationsMiscT('milestoneLibrary.suggested')}
              </span>
            )}

            {milestone.isDraft && (
              <span className="padding-right-1 model-to-operations__is-draft-tag padding-y-05">
                <Icon.Science
                  className="margin-left-1"
                  style={{ top: '2px' }}
                />{' '}
                {modelToOperationsMiscT('milestoneLibrary.isDraft')}
              </span>
            )}

            {mutationError && mutationError}

            <FormProvider {...methods}>
              <Form
                className="maxw-none"
                id="edit-milestone-form"
                onSubmit={handleSubmit(onSubmit)}
              >
                <h2 className="margin-y-2 margin-bottom-4 padding-bottom-4 line-height-large border-bottom-1px border-base-lighter">
                  {milestone.name}
                </h2>

                <p className="margin-top-0 margin-bottom-3 text-base">
                  <Trans
                    i18nKey={modelToOperationsMiscT('modal.allFieldsRequired')}
                    components={{
                      s: <span className="text-secondary-dark" />
                    }}
                  />
                </p>

                <Fieldset disabled={loading}>
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
