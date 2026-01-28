import React, { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Fieldset,
  Form,
  FormGroup,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import {
  GetIddocQuestionnaireMonitoringQuery,
  TypedUpdateIddocQuestionnaireDocument,
  useGetIddocQuestionnaireMonitoringQuery
} from 'gql/generated/graphql';

import AddNoteRHF from 'components/AddNote/AddNoteRHF';
import BooleanRadioRHF from 'components/BooleanRadioForm/BooleanRadioRHF';
import CheckboxField from 'components/CheckboxField';
import ConfirmLeaveRHF from 'components/ConfirmLeave/ConfirmLeaveRHF';
import FormFooter from 'components/FormFooter';
import MutationErrorModal from 'components/MutationErrorModal';
import PageNumber from 'components/PageNumber';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import { formatDateLocal } from 'utils/date';
import mapDefaultFormValues from 'utils/mapDefaultFormValues';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

export type IDDOCMonitoringFormType =
  GetIddocQuestionnaireMonitoringQuery['modelPlan']['questionnaires']['iddocQuestionnaire'];

const DEFAULT_FORM_VALUES: IDDOCMonitoringFormType = {
  __typename: 'IDDOCQuestionnaire',
  id: '',
  dataFullTimeOrIncremental: null,
  eftSetUp: null,
  unsolicitedAdjustmentsIncluded: null,
  dataFlowDiagramsNeeded: null,
  produceBenefitEnhancementFiles: null,
  fileNamingConventions: '',
  dataMonitoringNote: '',
  isIDDOCQuestionnaireComplete: false,
  completedByUserAccount: {
    __typename: 'UserAccount',
    id: '',
    commonName: ''
  },
  completedDts: ''
};

const IDDOCMonitoring = () => {
  const { t: iddocQuestionnaireT } = useTranslation('iddocQuestionnaire');

  const { t: iddocQuestionnaireMiscT } = useTranslation(
    'iddocQuestionnaireMisc'
  );
  const { t: additionalQuestionnairesT } = useTranslation(
    'additionalQuestionnaires'
  );

  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    dataFullTimeOrIncremental: dataFullTimeOrIncrementalConfig,
    eftSetUp: eftSetUpConfig,
    unsolicitedAdjustmentsIncluded: unsolicitedAdjustmentsIncludedConfig,
    dataFlowDiagramsNeeded: dataFlowDiagramsNeededConfig,
    produceBenefitEnhancementFiles: produceBenefitEnhancementFilesConfig,
    isIDDOCQuestionnaireComplete: isIDDOCQuestionnaireCompleteConfig
  } = usePlanTranslation('iddocQuestionnaire');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const navigate = useNavigate();

  const { data, loading, error } = useGetIddocQuestionnaireMonitoringQuery({
    variables: {
      id: modelID
    },
    skip: !modelID
  });

  const formData = mapDefaultFormValues<IDDOCMonitoringFormType>(
    data?.modelPlan?.questionnaires?.iddocQuestionnaire,
    DEFAULT_FORM_VALUES
  );

  const { __typename, id, ...defaultValues } = formData;

  const methods = useForm<IDDOCMonitoringFormType>({
    defaultValues,
    mode: 'onChange'
  });

  const {
    control,
    handleSubmit,
    formState: { touchedFields },
    watch,
    reset
  } = methods;

  const { mutationError, loading: isSubmitting } = useHandleMutation(
    TypedUpdateIddocQuestionnaireDocument,
    {
      id,
      rhfRef: {
        initialValues: defaultValues,
        values: watch()
      }
    }
  );

  useEffect(() => {
    reset(
      mapDefaultFormValues<IDDOCMonitoringFormType>(
        data?.modelPlan?.questionnaires?.iddocQuestionnaire,
        DEFAULT_FORM_VALUES
      )
    );
  }, [data, reset]);

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial errorMessage={error?.message} />;
  }

  return (
    <>
      <FormProvider {...methods}>
        <MutationErrorModal
          isOpen={mutationError.isModalOpen}
          closeModal={mutationError.closeModal}
          url={mutationError.destinationURL}
        />

        <Form
          className="maxw-none desktop:grid-col-6 margin-top-0"
          id="iddoc-questionnaire-monitoring"
          data-testid="iddoc-questionnaire-monitoring-form"
          onSubmit={handleSubmit(() => {
            navigate(
              `/models/${modelID}/collaboration-area/additional-questionnaires`
            );
          })}
        >
          <Fieldset disabled={!!error || loading}>
            <ConfirmLeaveRHF />

            <h3>{iddocQuestionnaireMiscT('dataMonitoringContinued')}</h3>

            <Controller
              name="dataFullTimeOrIncremental"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup>
                  <Label htmlFor={convertCamelCaseToKebabCase(field.name)}>
                    {iddocQuestionnaireT('dataFullTimeOrIncremental.label')}
                  </Label>

                  {getKeys(dataFullTimeOrIncrementalConfig.options).map(key => (
                    <Radio
                      key={key}
                      id={`${convertCamelCaseToKebabCase(field.name)}-${key}`}
                      name={field.name}
                      label={dataFullTimeOrIncrementalConfig.options[key]}
                      value={key}
                      checked={field.value === key}
                      onChange={() => {
                        field.onChange(key);
                      }}
                    />
                  ))}
                </FormGroup>
              )}
            />

            <Controller
              name="eftSetUp"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-top-6">
                  <Label htmlFor={convertCamelCaseToKebabCase(field.name)}>
                    {iddocQuestionnaireT('eftSetUp.label')}
                  </Label>

                  <BooleanRadioRHF
                    field={field.name}
                    control={control}
                    value={field.value}
                    options={eftSetUpConfig.options}
                    className="margin-top-0 margin-right-1"
                  />
                </FormGroup>
              )}
            />

            <Controller
              name="unsolicitedAdjustmentsIncluded"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-top-6">
                  <Label htmlFor={convertCamelCaseToKebabCase(field.name)}>
                    {iddocQuestionnaireT(
                      'unsolicitedAdjustmentsIncluded.label'
                    )}
                  </Label>

                  <BooleanRadioRHF
                    field={field.name}
                    control={control}
                    value={field.value}
                    options={unsolicitedAdjustmentsIncludedConfig.options}
                    className="margin-top-0 margin-right-1"
                  />
                </FormGroup>
              )}
            />

            <Controller
              name="dataFlowDiagramsNeeded"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-top-6">
                  <Label htmlFor={convertCamelCaseToKebabCase(field.name)}>
                    {iddocQuestionnaireT('dataFlowDiagramsNeeded.label')}
                  </Label>

                  <BooleanRadioRHF
                    field={field.name}
                    control={control}
                    value={field.value}
                    options={dataFlowDiagramsNeededConfig.options}
                    className="margin-top-0 margin-right-1"
                  />
                </FormGroup>
              )}
            />

            <Controller
              name="produceBenefitEnhancementFiles"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-top-6">
                  <Label htmlFor={convertCamelCaseToKebabCase(field.name)}>
                    {iddocQuestionnaireT(
                      'produceBenefitEnhancementFiles.label'
                    )}
                  </Label>

                  <p className="text-base margin-y-1">
                    {iddocQuestionnaireT(
                      'produceBenefitEnhancementFiles.sublabel'
                    )}
                  </p>

                  <BooleanRadioRHF
                    field={field.name}
                    control={control}
                    value={field.value}
                    options={produceBenefitEnhancementFilesConfig.options}
                    className="margin-top-0 margin-right-1"
                  />
                </FormGroup>
              )}
            />

            <Controller
              name="fileNamingConventions"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-top-6">
                  <Label htmlFor={convertCamelCaseToKebabCase(field.name)}>
                    {iddocQuestionnaireT('fileNamingConventions.label')}
                  </Label>

                  <TextInput
                    {...field}
                    id={convertCamelCaseToKebabCase(field.name)}
                    maxLength={50}
                    type="text"
                    value={field.value || ''}
                  />
                </FormGroup>
              )}
            />

            <AddNoteRHF
              field="dataMonitoringNote"
              control={control}
              touched={!!touchedFields.dataMonitoringNote}
              className="margin-top-0"
            />

            <Controller
              name="isIDDOCQuestionnaireComplete"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="border-2px border-base-light radius-md padding-2">
                  <Label
                    htmlFor={convertCamelCaseToKebabCase(field.name)}
                    className="text-normal"
                  >
                    {isIDDOCQuestionnaireCompleteConfig.label}
                  </Label>

                  <FormGroup className="margin-0">
                    <CheckboxField
                      name="iddocQuestionnaireIsComplete"
                      id="iddoc-questionnaire-is-complete-true"
                      checked={field.value === true}
                      value="true"
                      label={isIDDOCQuestionnaireCompleteConfig.options.true}
                      onChange={e => {
                        field.onChange(e.target.checked);
                      }}
                      onBlur={field.onBlur}
                    />
                    {formData.completedByUserAccount?.commonName &&
                      formData.completedDts && (
                        <p className="margin-top-1 margin-bottom-0 margin-left-4 text-base">
                          {miscellaneousT('markedComplete', {
                            user: formData.completedByUserAccount.commonName
                          })}
                          {formatDateLocal(formData.completedDts, 'MM/dd/yyyy')}
                        </p>
                      )}
                  </FormGroup>
                </FormGroup>
              )}
            />

            <FormFooter
              id="iddoc-questionnaire-monitoring-form"
              homeArea={additionalQuestionnairesT(
                'saveAndReturnToQuestionnaires'
              )}
              homeRoute={`/models/${modelID}/collaboration-area/additional-questionnaires`}
              backPage={`/models/${modelID}/collaboration-area/additional-questionnaires/iddoc-questionnaire/testing`}
              nextPage={false}
              disabled={isSubmitting}
            />
          </Fieldset>
        </Form>
      </FormProvider>

      <PageNumber currentPage={3} totalPages={3} className="margin-y-6" />
    </>
  );
};

export default IDDOCMonitoring;
