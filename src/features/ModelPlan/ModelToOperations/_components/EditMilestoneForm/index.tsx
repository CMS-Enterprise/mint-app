import React, { useEffect, useMemo, useState } from 'react';
import {
  Controller,
  Form,
  FormProvider,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  FormGroup,
  Grid,
  GridContainer,
  Icon,
  Label,
  Radio,
  Select
} from '@trussworks/react-uswds';
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
import DatePickerFormatted from 'components/DatePickerFormatted';
import DatePickerWarning from 'components/DatePickerWarning';
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
import {
  composeMultiSelectOptions,
  convertCamelCaseToKebabCase
} from 'utils/modelPlan';

import '../../index.scss';

type FormValues = {
  name: string;
  categories: {
    category: {
      id: string;
      name: string;
    };
    subcategory: {
      id: string;
      name: string;
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

  const { data, loading, error } = useGetMtoMilestoneQuery({
    variables: {
      id: editMilestoneID || ''
    }
  });

  const milestone = useMemo(() => {
    return data?.mtoMilestone;
  }, [data]);

  const defaultValues = useMemo(() => {
    return {
      defaultValues: {
        categories: {
          category: {
            id: milestone?.categories.category.id || 'default'
          },
          subcategory: {
            id: milestone?.categories.subCategory.id || 'default'
          }
        },
        name: milestone?.name || '',
        facilitatedBy: milestone?.facilitatedBy || [],
        needBy: milestone?.needBy || '',
        status: milestone?.status || MtoMilestoneStatus.NOT_STARTED,
        riskIndicator: milestone?.riskIndicator || MtoRiskIndicator.ON_TRACK,
        isDraft: milestone?.isDraft || false
      }
    };
  }, [milestone]);

  // Variables for the form
  const methods = useForm<FormValues>(defaultValues);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isValid, isSubmitting }
  } = methods;

  const {
    selectOptionsAndMappedCategories,
    mappedSubcategories,
    selectOptions
  } = useFormatMTOCategories({
    modelID,
    primaryCategory: watch('categories.category.id')
  });

  useEffect(() => {
    reset(defaultValues.defaultValues);
  }, [defaultValues, reset]);

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

    if (formData.categories.subcategory.id !== uncategorizedCategoryID) {
      mtoCategoryID = formData.categories.subcategory.id;
    } else if (formData.categories.category.id === uncategorizedCategoryID) {
      mtoCategoryID = null;
    } else {
      mtoCategoryID = formData.categories.category.id;
    }

    const { categories, needBy, name, ...formChanges } = formData;

    updateMilestone({
      variables: {
        id: editMilestoneID || '',
        changes: {
          ...formChanges,
          mtoCategoryID,
          ...(!!needBy && { needBy: new Date(needBy)?.toISOString() }),
          ...(!milestone?.addedFromMilestoneLibrary && { name })
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

  if (!milestone || error) {
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
                    rules={{
                      required: true,
                      validate: value => value !== 'default'
                    }}
                    render={({ field: { ref, ...field } }) => (
                      <FormGroup className="margin-top-0 margin-bottom-3">
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

                        <Select
                          {...field}
                          id={convertCamelCaseToKebabCase(field.name)}
                          value={field.value || ''}
                          defaultValue="default"
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
                    name="categories.subcategory.id"
                    control={control}
                    rules={{
                      required: true,
                      validate: value => value !== 'default'
                    }}
                    render={({ field: { ref, ...field } }) => (
                      <FormGroup className="margin-top-0 margin-bottom-3">
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

                        <Select
                          {...field}
                          id={convertCamelCaseToKebabCase(field.name)}
                          value={field.value || ''}
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
                            maxLength={50}
                            name={field.name}
                            defaultValue={field.value}
                            onChange={e => field.onChange(e || undefined)}
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
                  <Button type="submit" disabled={isSubmitting}>
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
