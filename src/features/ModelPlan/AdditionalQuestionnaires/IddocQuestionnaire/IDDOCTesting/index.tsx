import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Fieldset, Label, TextInput } from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import { Field, Formik, FormikProps } from 'formik';
import {
  GetIddocQuestionnaireTestingQuery,
  IddocFileType,
  TypedUpdateIddocQuestionnaireDocument,
  useGetIddocQuestionnaireTestingQuery
} from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import ConfirmLeave from 'components/ConfirmLeave';
import FieldGroup from 'components/FieldGroup';
import FormFooter from 'components/FormFooter';
import MINTForm from 'components/MINTForm';
import MutationErrorModal from 'components/MutationErrorModal';
import PageNumber from 'components/PageNumber';
import TextAreaField from 'components/TextAreaField';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';

export type IDDOCTestingFormType =
  GetIddocQuestionnaireTestingQuery['modelPlan']['questionnaires']['iddocQuestionnaire'];

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

  const formikRef = useRef<FormikProps<IDDOCTestingFormType>>(null);
  const navigate = useNavigate();

  const { data, loading, error } = useGetIddocQuestionnaireTestingQuery({
    variables: {
      id: modelID
    }
  });

  const {
    id,
    uatNeeds,
    stcNeeds,
    testingTimelines,
    testingNote,
    dataMonitoringFileTypes,
    dataMonitoringFileOther,
    dataResponseType,
    dataResponseFileFrequency
  } = (data?.modelPlan?.questionnaires?.iddocQuestionnaire ||
    {}) as IDDOCTestingFormType;

  const { mutationError } = useHandleMutation(
    TypedUpdateIddocQuestionnaireDocument,
    {
      id,
      formikRef: formikRef as any
    }
  );

  const initialValues: IDDOCTestingFormType = {
    __typename: 'IDDOCQuestionnaire',
    id: id ?? '',
    uatNeeds: uatNeeds ?? '',
    stcNeeds: stcNeeds ?? '',
    testingTimelines: testingTimelines ?? '',
    testingNote: testingNote ?? '',
    dataMonitoringFileTypes: dataMonitoringFileTypes ?? [],
    dataMonitoringFileOther: dataMonitoringFileOther ?? '',
    dataResponseType: dataResponseType ?? '',
    dataResponseFileFrequency: dataResponseFileFrequency ?? ''
  };

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial errorMessage={error?.message} />;
  }

  return (
    <>
      <MutationErrorModal
        isOpen={mutationError.isModalOpen}
        closeModal={mutationError.closeModal}
        url={mutationError.destinationURL}
      />

      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          navigate(
            `/models/${modelID}/collaboration-area/additional-questionnaires/iddoc-questionnaire/monitoring`
          );
        }}
        enableReinitialize
        innerRef={formikRef}
        data-testid="iddoc-questionnaire-testing"
      >
        {(formikProps: FormikProps<IDDOCTestingFormType>) => {
          const { handleSubmit, values } = formikProps;

          return (
            <>
              <ConfirmLeave />

              <MINTForm
                className="desktop:grid-col-6 margin-top-0"
                data-testid="iddoc-questionnaire-testing-form"
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={!!error || loading}>
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

                  <FieldGroup className="margin-top-6">
                    <Label htmlFor="iddoc-questionnaire-uat-needs">
                      {iddocQuestionnaireT('uatNeeds.label')}
                    </Label>

                    <Field
                      as={TextAreaField}
                      className="height-15"
                      id="iddoc-questionnaire-uat-needs"
                      name="uatNeeds"
                    />
                  </FieldGroup>

                  <FieldGroup className="margin-top-6">
                    <Label htmlFor="iddoc-questionnaire-stc-needs">
                      {iddocQuestionnaireT('stcNeeds.label')}
                    </Label>

                    <Field
                      as={TextAreaField}
                      className="height-15"
                      id="iddoc-questionnaire-stc-needs"
                      data-testid="iddoc-questionnaire-stc-needs"
                      name="stcNeeds"
                    />
                  </FieldGroup>

                  <FieldGroup className="margin-top-6">
                    <Label htmlFor="iddoc-questionnaire-testing-timelines">
                      {iddocQuestionnaireT('testingTimelines.label')}
                    </Label>

                    <Field
                      as={TextAreaField}
                      className="height-15"
                      id="iddoc-questionnaire-testing-timelines"
                      name="testingTimelines"
                    />
                  </FieldGroup>

                  <AddNote
                    id="iddoc-questionnaire-testing-note"
                    field="testingNote"
                  />

                  <h3>{iddocQuestionnaireMiscT('dataMonitoringHeading')}</h3>

                  <FieldGroup>
                    <Label htmlFor="iddoc-questionnaire-data-monitoring-file">
                      {iddocQuestionnaireT('dataMonitoringFileTypes.label')}
                    </Label>

                    {getKeys(dataMonitoringFileTypesConfig.options).map(
                      type => {
                        return (
                          <Fragment key={type}>
                            <Field
                              as={CheckboxField}
                              id={`iddoc-questionnaire-data-monitoring-file-${type}`}
                              name="dataMonitoringFileTypes"
                              label={
                                dataMonitoringFileTypesConfig.options[type]
                              }
                              value={type}
                              checked={values?.dataMonitoringFileTypes.includes(
                                type
                              )}
                            />

                            {type === IddocFileType.OTHER &&
                              values.dataMonitoringFileTypes.includes(
                                IddocFileType.OTHER
                              ) && (
                                <div className="margin-left-4">
                                  <Label
                                    htmlFor="iddoc-questionnaire-data-monitoring-file-other"
                                    className="text-normal"
                                  >
                                    {iddocQuestionnaireT(
                                      'dataMonitoringFileOther.label'
                                    )}
                                  </Label>

                                  <Field
                                    as={TextInput}
                                    id="iddoc-questionnaire-data-monitoring-file-other"
                                    name="dataMonitoringFileOther"
                                  />
                                </div>
                              )}
                          </Fragment>
                        );
                      }
                    )}
                  </FieldGroup>

                  <FieldGroup className="margin-top-6">
                    <Label htmlFor="iddoc-questionnaire-data-response-type">
                      {iddocQuestionnaireT('dataResponseType.label')}
                    </Label>

                    <Field
                      as={TextInput}
                      id="iddoc-questionnaire-data-response-type"
                      maxLength={50}
                      name="dataResponseType"
                    />
                  </FieldGroup>

                  <FieldGroup className="margin-top-6">
                    <Label htmlFor="iddoc-questionnaire-data-file-frequency">
                      {iddocQuestionnaireT('dataResponseFileFrequency.label')}
                    </Label>

                    <Field
                      as={TextInput}
                      id="iddoc-questionnaire-data-file-frequency"
                      maxLength={50}
                      name="dataResponseFileFrequency"
                    />
                  </FieldGroup>

                  <FormFooter
                    homeArea={additionalQuestionnairesT(
                      'saveAndReturnToQuestionnaires'
                    )}
                    homeRoute={`/models/${modelID}/collaboration-area/additional-questionnaires`}
                    backPage={`/models/${modelID}/collaboration-area/additional-questionnaires/iddoc-questionnaire/operations`}
                    nextPage
                    disabled={!!error || loading} // TODO: add or replace with issubmitting once refactored form
                    id="iddoc-questionnaire-testing-form"
                  />
                </Fieldset>
              </MINTForm>
            </>
          );
        }}
      </Formik>

      <PageNumber currentPage={2} totalPages={3} className="margin-y-6" />
    </>
  );
};

export default IDDOCTesting;
