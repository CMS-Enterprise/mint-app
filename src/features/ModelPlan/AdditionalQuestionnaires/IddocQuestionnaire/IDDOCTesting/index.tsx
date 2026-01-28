import React, { Fragment, useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Fieldset,
  Form,
  FormGroup,
  Label,
  Textarea,
  TextInput
} from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import {
  GetIddocQuestionnaireTestingQuery,
  IddocFileType,
  TypedUpdateIddocQuestionnaireDocument,
  useGetIddocQuestionnaireTestingQuery
} from 'gql/generated/graphql';

import AddNoteRHF from 'components/AddNote/AddNoteRHF';
import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import ConfirmLeaveRHF from 'components/ConfirmLeave/ConfirmLeaveRHF';
import FormFooter from 'components/FormFooter';
import MutationErrorModal from 'components/MutationErrorModal';
import PageNumber from 'components/PageNumber';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import { onChangeCheckboxHandler } from 'utils/formUtil';
import mapDefaultFormValues from 'utils/mapDefaultFormValues';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

export type IDDOCTestingFormType =
  GetIddocQuestionnaireTestingQuery['modelPlan']['questionnaires']['iddocQuestionnaire'];

const DEFAULT_FORM_VALUES: IDDOCTestingFormType = {
  __typename: 'IDDOCQuestionnaire',
  id: '',
  uatNeeds: '',
  stcNeeds: '',
  testingTimelines: '',
  testingNote: '',
  dataMonitoringFileTypes: [],
  dataMonitoringFileOther: '',
  dataResponseType: '',
  dataResponseFileFrequency: ''
};

const IDDOCTesting = () => {
  const { t: iddocQuestionnaireT } = useTranslation('iddocQuestionnaire');

  const { t: iddocQuestionnaireMiscT } = useTranslation(
    'iddocQuestionnaireMisc'
  );
  const { t: additionalQuestionnairesT } = useTranslation(
    'additionalQuestionnaires'
  );

  const { dataMonitoringFileTypes: dataMonitoringFileTypesConfig } =
    usePlanTranslation('iddocQuestionnaire');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const navigate = useNavigate();

  const { data, loading, error } = useGetIddocQuestionnaireTestingQuery({
    variables: {
      id: modelID
    },
    skip: !modelID
  });

  const formData = mapDefaultFormValues<IDDOCTestingFormType>(
    data?.modelPlan?.questionnaires?.iddocQuestionnaire,
    DEFAULT_FORM_VALUES
  );

  const { __typename, id, ...defaultValues } = formData;

  const methods = useForm<IDDOCTestingFormType>({
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
      mapDefaultFormValues<IDDOCTestingFormType>(
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
          id="iddoc-questionnaire-testing"
          data-testid="iddoc-questionnaire-testing-form"
          onSubmit={handleSubmit(() => {
            navigate(
              `/models/${modelID}/collaboration-area/additional-questionnaires/iddoc-questionnaire/monitoring`
            );
          })}
        >
          <Fieldset disabled={!!error || loading}>
            <ConfirmLeaveRHF />

            <h3>{iddocQuestionnaireMiscT('testingHeading')}</h3>

            <Alert
              type="info"
              slim
              data-testid="mandatory-fields-alert"
              className="margin-bottom-4"
            >
              <span className="mandatory-fields-alert__text">
                {iddocQuestionnaireMiscT('ssmRequest')}
              </span>
            </Alert>

            <Controller
              name="uatNeeds"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-top-6">
                  <Label htmlFor={convertCamelCaseToKebabCase(field.name)}>
                    {iddocQuestionnaireT('uatNeeds.label')}
                  </Label>

                  <Textarea
                    {...field}
                    className="height-15"
                    id={convertCamelCaseToKebabCase(field.name)}
                    data-testid={convertCamelCaseToKebabCase(field.name)}
                    value={field.value || ''}
                  />
                </FormGroup>
              )}
            />

            <Controller
              name="stcNeeds"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-top-6">
                  <Label htmlFor={convertCamelCaseToKebabCase(field.name)}>
                    {iddocQuestionnaireT('stcNeeds.label')}
                  </Label>

                  <Textarea
                    {...field}
                    className="height-15"
                    id={convertCamelCaseToKebabCase(field.name)}
                    data-testid={convertCamelCaseToKebabCase(field.name)}
                    value={field.value || ''}
                  />
                </FormGroup>
              )}
            />

            <Controller
              name="testingTimelines"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-top-6">
                  <Label htmlFor={convertCamelCaseToKebabCase(field.name)}>
                    {iddocQuestionnaireT('testingTimelines.label')}
                  </Label>

                  <Textarea
                    {...field}
                    className="height-15"
                    id={convertCamelCaseToKebabCase(field.name)}
                    data-testid={convertCamelCaseToKebabCase(field.name)}
                    value={field.value || ''}
                  />
                </FormGroup>
              )}
            />

            <AddNoteRHF
              field="testingNote"
              control={control}
              touched={!!touchedFields?.testingNote}
              className="margin-top-0"
            />

            <h3>{iddocQuestionnaireMiscT('dataMonitoringHeading')}</h3>

            <Controller
              name="dataMonitoringFileTypes"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup>
                  <Label htmlFor={convertCamelCaseToKebabCase(field.name)}>
                    {iddocQuestionnaireT('dataMonitoringFileTypes.label')}
                  </Label>

                  {getKeys(dataMonitoringFileTypesConfig.options).map(type => {
                    return (
                      <Fragment key={type}>
                        <CheckboxField
                          id={`${convertCamelCaseToKebabCase(
                            field.name
                          )}-${type}`}
                          name={field.name}
                          label={dataMonitoringFileTypesConfig.options[type]}
                          value={type}
                          checked={field.value.includes(type)}
                          onBlur={field.onBlur}
                          onChange={e => {
                            if (
                              type === IddocFileType.OTHER &&
                              !e.target.checked
                            ) {
                              setValue('dataMonitoringFileOther', '', {
                                shouldValidate: true,
                                shouldDirty: true,
                                shouldTouch: true
                              });
                            }
                            onChangeCheckboxHandler<IddocFileType>(
                              e.target.value as IddocFileType,
                              field
                            );
                          }}
                        />

                        {watch('dataMonitoringFileTypes')?.includes(
                          IddocFileType.OTHER
                        ) &&
                          type === IddocFileType.OTHER && (
                            <Controller
                              name="dataMonitoringFileOther"
                              control={control}
                              render={({
                                field: { ref: ref2, ...fieldOther }
                              }) => (
                                <div className="margin-left-4">
                                  <Label
                                    htmlFor={`${convertCamelCaseToKebabCase(
                                      fieldOther.name
                                    )}-${type}`}
                                    className="text-normal"
                                  >
                                    {iddocQuestionnaireT(
                                      'dataMonitoringFileOther.label'
                                    )}
                                  </Label>

                                  <TextInput
                                    {...fieldOther}
                                    id={`${convertCamelCaseToKebabCase(
                                      fieldOther.name
                                    )}-${type}`}
                                    type="text"
                                    value={fieldOther.value || ''}
                                  />
                                </div>
                              )}
                            />
                          )}
                      </Fragment>
                    );
                  })}
                </FormGroup>
              )}
            />

            <Controller
              name="dataResponseType"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-top-6">
                  <Label htmlFor={convertCamelCaseToKebabCase(field.name)}>
                    {iddocQuestionnaireT('dataResponseType.label')}
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
              name="dataResponseFileFrequency"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-top-6">
                  <Label htmlFor={convertCamelCaseToKebabCase(field.name)}>
                    {iddocQuestionnaireT('dataResponseFileFrequency.label')}
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

            <FormFooter
              homeArea={additionalQuestionnairesT(
                'saveAndReturnToQuestionnaires'
              )}
              homeRoute={`/models/${modelID}/collaboration-area/additional-questionnaires`}
              backPage={`/models/${modelID}/collaboration-area/additional-questionnaires/iddoc-questionnaire/operations`}
              nextPage
              disabled={isSubmitting}
              id="iddoc-questionnaire-testing-form"
            />
          </Fieldset>
        </Form>
      </FormProvider>

      <PageNumber currentPage={2} totalPages={3} className="margin-y-6" />
    </>
  );
};

export default IDDOCTesting;
