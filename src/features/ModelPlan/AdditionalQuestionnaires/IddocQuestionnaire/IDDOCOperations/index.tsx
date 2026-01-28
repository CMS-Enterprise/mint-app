import React, { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Fieldset,
  Form,
  FormGroup,
  Label,
  Textarea,
  TextInput
} from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import {
  GetIddocQuestionnaireOperationsQuery,
  TypedUpdateIddocQuestionnaireDocument,
  useGetIddocQuestionnaireOperationsQuery
} from 'gql/generated/graphql';

import AddNoteRHF from 'components/AddNote/AddNoteRHF';
import BooleanRadioRHF from 'components/BooleanRadioForm/BooleanRadioRHF';
import ConfirmLeaveRHF from 'components/ConfirmLeave/ConfirmLeaveRHF';
import DatePickerFormatted from 'components/DatePickerFormatted';
import DatePickerWarning from 'components/DatePickerWarning';
import FormFooter from 'components/FormFooter';
import HelpText from 'components/HelpText';
import MutationErrorModal from 'components/MutationErrorModal';
import PageNumber from 'components/PageNumber';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { isDateInPast } from 'utils/date';
import mapDefaultFormValues from 'utils/mapDefaultFormValues';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

export type IDDOCOperationsDataType =
  GetIddocQuestionnaireOperationsQuery['modelPlan']['questionnaires']['iddocQuestionnaire'];

const DEFAULT_FORM_VALUES: IDDOCOperationsDataType = {
  __typename: 'IDDOCQuestionnaire',
  id: '',
  technicalContactsIdentified: null,
  technicalContactsIdentifiedDetail: '',
  technicalContactsIdentifiedNote: '',
  captureParticipantInfo: null,
  captureParticipantInfoNote: '',
  icdOwner: '',
  draftIcdDueDate: '',
  icdNote: ''
};

const IDDOCOperations = () => {
  const { t: iddocQuestionnaireT } = useTranslation('iddocQuestionnaire');
  const { t: iddocQuestionnaireMiscT } = useTranslation(
    'iddocQuestionnaireMisc'
  );
  const { t: additionalQuestionnairesT } = useTranslation(
    'additionalQuestionnaires'
  );
  const { t: generalT } = useTranslation('general');

  const {
    technicalContactsIdentified: technicalContactsIdentifiedConfig,
    captureParticipantInfo: captureParticipantInfoConfig
  } = usePlanTranslation('iddocQuestionnaire');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const navigate = useNavigate();

  const { data, loading, error } = useGetIddocQuestionnaireOperationsQuery({
    variables: {
      id: modelID
    },
    skip: !modelID
  });

  const formData = mapDefaultFormValues<IDDOCOperationsDataType>(
    data?.modelPlan?.questionnaires?.iddocQuestionnaire,
    DEFAULT_FORM_VALUES
  );

  const { __typename, id, ...defaultValues } = formData;

  const methods = useForm<IDDOCOperationsDataType>({
    defaultValues,
    mode: 'onChange'
  });

  const {
    control,
    handleSubmit,
    formState: { touchedFields },
    watch,
    setValue,
    reset
  } = methods;

  const { mutationError, loading: isSubmitting } =
    useHandleMutation<IDDOCOperationsDataType>(
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
      mapDefaultFormValues<IDDOCOperationsDataType>(
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
          className="maxw-none desktop:grid-col-6 margin-top-6"
          id="iddoc-questionnaire-operations"
          data-testid="iddoc-questionnaire-operations-form"
          onSubmit={handleSubmit(() => {
            navigate(
              `/models/${modelID}/collaboration-area/additional-questionnaires/iddoc-questionnaire/testing`
            );
          })}
        >
          <Fieldset disabled={!!error || loading}>
            <ConfirmLeaveRHF />

            <h3>{iddocQuestionnaireMiscT('iddocHeading')}</h3>

            <Controller
              name="technicalContactsIdentified"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-top-4">
                  <Label htmlFor={convertCamelCaseToKebabCase(field.name)}>
                    {iddocQuestionnaireT('technicalContactsIdentified.label')}
                  </Label>

                  <BooleanRadioRHF
                    field="technicalContactsIdentified"
                    control={control}
                    value={field.value}
                    options={technicalContactsIdentifiedConfig.options}
                    childName="technicalContactsIdentifiedDetail"
                    setValue={setValue}
                    className="margin-top-0 margin-right-1"
                  >
                    {String(watch('technicalContactsIdentified')) ===
                      'true' && (
                      <Controller
                        name="technicalContactsIdentifiedDetail"
                        control={control}
                        render={({
                          field: { ref: detailRef, ...detailField }
                        }) => (
                          <FormGroup className="margin-left-4 margin-top-1">
                            <Label
                              htmlFor={convertCamelCaseToKebabCase(
                                detailField.name
                              )}
                              className="text-normal"
                            >
                              {iddocQuestionnaireT(
                                'technicalContactsIdentifiedDetail.label'
                              )}
                            </Label>

                            <Textarea
                              {...detailField}
                              id={convertCamelCaseToKebabCase(detailField.name)}
                              maxLength={5000}
                              value={detailField.value || ''}
                              className="mint-textarea"
                            />
                          </FormGroup>
                        )}
                      />
                    )}
                  </BooleanRadioRHF>
                </FormGroup>
              )}
            />

            <AddNoteRHF
              className="margin-top-0"
              field="technicalContactsIdentifiedNote"
              control={control}
              touched={!!touchedFields?.technicalContactsIdentifiedNote}
            />

            <Controller
              name="captureParticipantInfo"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-top-4">
                  <Label htmlFor={convertCamelCaseToKebabCase(field.name)}>
                    {iddocQuestionnaireT('captureParticipantInfo.label')}
                  </Label>

                  <p className="text-base margin-bottom-1 margin-top-1">
                    {iddocQuestionnaireT('captureParticipantInfo.sublabel')}
                  </p>

                  <BooleanRadioRHF
                    field={field.name}
                    control={control}
                    value={field.value}
                    options={captureParticipantInfoConfig.options}
                    className="margin-top-0 margin-right-1"
                  />
                </FormGroup>
              )}
            />

            <AddNoteRHF
              className="margin-y-0"
              field="captureParticipantInfoNote"
              control={control}
              touched={!!touchedFields?.captureParticipantInfoNote}
            />

            <h3 className="margin-top-4 margin-bottom-2">
              {iddocQuestionnaireMiscT('icdHeading')}
            </h3>

            <p className="margin-y-0 line-height-body-4">
              {iddocQuestionnaireMiscT('icdSubheading')}
            </p>

            <Controller
              name="icdOwner"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-top-4">
                  <Label htmlFor={convertCamelCaseToKebabCase(field.name)}>
                    {iddocQuestionnaireT('icdOwner.label')}
                  </Label>

                  <TextInput
                    {...field}
                    id={convertCamelCaseToKebabCase(field.name)}
                    data-testid={convertCamelCaseToKebabCase(field.name)}
                    type="text"
                    value={field.value || ''}
                    maxLength={50}
                  />
                </FormGroup>
              )}
            />

            <Controller
              name="draftIcdDueDate"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-top-6">
                  <Label htmlFor={convertCamelCaseToKebabCase(field.name)}>
                    {iddocQuestionnaireT('draftIcdDueDate.label')}
                  </Label>
                  <HelpText className="usa-hint">
                    {generalT('datePlaceholder')}
                  </HelpText>

                  <div className="position-relative">
                    <DatePickerFormatted
                      {...field}
                      aria-labelledby={convertCamelCaseToKebabCase(field.name)}
                      id={convertCamelCaseToKebabCase(field.name)}
                      defaultValue={field.value || ''}
                      value={field.value || ''}
                      suppressMilliseconds
                    />
                    {isDateInPast(watch('draftIcdDueDate')) && (
                      <DatePickerWarning label={generalT('dateWarning')} />
                    )}
                  </div>
                  {isDateInPast(watch('draftIcdDueDate')) && (
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

            <AddNoteRHF
              field="icdNote"
              control={control}
              touched={!!touchedFields?.icdNote}
              className="margin-top-0"
            />

            <FormFooter
              id="iddoc-questionnaire-operations-form"
              homeArea={additionalQuestionnairesT(
                'saveAndReturnToQuestionnaires'
              )}
              homeRoute={`/models/${modelID}/collaboration-area/additional-questionnaires`}
              nextPage
              disabled={isSubmitting}
            />
          </Fieldset>
        </Form>
      </FormProvider>

      <PageNumber currentPage={1} totalPages={3} className="margin-y-6" />
    </>
  );
};

export default IDDOCOperations;
