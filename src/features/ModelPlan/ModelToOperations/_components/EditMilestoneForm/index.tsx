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
  Card,
  Checkbox,
  Fieldset,
  FormGroup,
  Grid,
  GridContainer,
  Icon,
  Label,
  Select
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import SolutionDetailsModal from 'features/HelpAndKnowledge/SolutionsHelp/SolutionDetails/Modal';
import {
  HelpSolutionBaseType,
  helpSolutions
} from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import {
  GetModelToOperationsMatrixDocument,
  MtoFacilitator,
  MtoMilestoneStatus,
  MtoRiskIndicator,
  useGetModelToOperationsMatrixQuery,
  useGetMtoMilestoneQuery,
  useUpdateMtoMilestoneMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import HelpText from 'components/HelpText';
import MultiSelect from 'components/MultiSelect';
import PageLoading from 'components/PageLoading';
import useFormatMTOCategories from 'hooks/useFormatMTOCategories';
import useMessage from 'hooks/useMessage';
import useModalSolutionState from 'hooks/useModalSolutionState';
import usePlanTranslation from 'hooks/usePlanTranslation';
import {
  composeMultiSelectOptions,
  convertCamelCaseToKebabCase
} from 'utils/modelPlan';

import { MilestoneCardType } from '../../MilestoneLibrary';
import { GetModelToOperationsMatrixQueryType } from '../Table';
import { MilestoneType } from '../Table/columns';

import '../../index.scss';

type FormValues = {
  name: string;
  primaryCategory: string;
  subcategory: string;
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

  const { facilitatedBy: facilitatedByConfig } =
    usePlanTranslation('mtoMilestone');

  const history = useHistory();

  const { modelID } = useParams<{ modelID: string }>();

  const params = useMemo(
    () => new URLSearchParams(history.location.search),
    [history]
  );

  const editMilestoneID = params.get('edit-milestone');

  const { message, showMessage, clearMessage } = useMessage();

  const { data, loading, error } = useGetMtoMilestoneQuery({
    variables: {
      id: editMilestoneID || ''
    }
  });

  const milestone = useMemo(() => {
    return data?.mtoMilestone;
  }, [data]);

  // Variables for the form
  const methods = useForm<FormValues>({
    defaultValues: {
      primaryCategory: 'default',
      subcategory: 'default',
      name: ''
    }
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isValid }
  } = methods;

  const {
    selectOptionsAndMappedCategories,
    mappedSubcategories,
    selectOptions
  } = useFormatMTOCategories({
    modelID,
    primaryCategory: watch('primaryCategory')
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

  const onSubmit: SubmitHandler<FormValues> = formData => {
    let mtoCategoryID;

    const uncategorizedCategoryID = '00000000-0000-0000-0000-000000000000';

    if (formData.subcategory !== uncategorizedCategoryID) {
      mtoCategoryID = formData.subcategory;
    } else if (formData.primaryCategory === uncategorizedCategoryID) {
      mtoCategoryID = null;
    } else {
      mtoCategoryID = formData.primaryCategory;
    }

    const { primaryCategory, subcategory, ...formChanges } = formData;

    updateMilestone({
      variables: {
        id: modelID,
        changes: {
          ...formChanges,
          mtoCategoryID
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
                      'modal.milestone.alert.success'
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
        showMessage(
          <Alert
            type="error"
            slim
            data-testid="error-alert"
            className="margin-y-4"
          >
            {modelToOperationsMiscT('modal.milestone.alert.error')}
          </Alert>
        );
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

            <FormProvider {...methods}>
              {message}
              <Form
                className="maxw-none"
                id="edit-milestone-form"
                // onSubmit={handleSubmit(onSubmit)}
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
                          id="nda-check"
                          name="isDraft"
                          label={mtoMilestoneT('isDraft.label')}
                          subLabel={mtoMilestoneT('isDraft.sublabel')}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          value="true"
                        />
                      </FormGroup>
                    )}
                  />

                  <Controller
                    name="primaryCategory"
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
                              <option
                                key={`sort-${convertCamelCaseToKebabCase(option.label)}`}
                                value={option.value}
                              >
                                {option.label}
                              </option>
                            );
                          })}
                        </Select>
                      </FormGroup>
                    )}
                  />

                  <Controller
                    name="subcategory"
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
                          disabled={watch('primaryCategory') === 'default'}
                        >
                          {[selectOptions[0], ...mappedSubcategories].map(
                            option => {
                              return (
                                <option
                                  key={`sort-${convertCamelCaseToKebabCase(option.label)}`}
                                  value={option.value}
                                >
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
                      <FormGroup className="margin-0">
                        <Label
                          htmlFor={convertCamelCaseToKebabCase(
                            'commonSolutions'
                          )}
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
                          inputId={convertCamelCaseToKebabCase(
                            'commonSolutions'
                          )}
                          ariaLabel={convertCamelCaseToKebabCase(
                            'commonSolutions'
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
                </Fieldset>
              </Form>
            </FormProvider>
          </Grid>
        </Grid>
      </GridContainer>
    </>
  );
};

export default EditMilestoneForm;
