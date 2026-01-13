import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Fieldset, Label, TextInput } from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import { Field, Formik, FormikProps } from 'formik';
import {
  GetIddocQuery,
  TypedUpdatePlanOpsEvalAndLearningDocument,
  useGetIddocQuery
} from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import BooleanRadio from 'components/BooleanRadioForm';
import ConfirmLeave from 'components/ConfirmLeave';
import MINTDatePicker from 'components/DatePicker';
import FieldGroup from 'components/FieldGroup';
import FormFooter from 'components/FormFooter';
import MINTForm from 'components/MINTForm';
import MutationErrorModal from 'components/MutationErrorModal';
import PageNumber from 'components/PageNumber';
import TextAreaField from 'components/TextAreaField';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';

type IDDOCFormType = GetIddocQuery['modelPlan']['opsEvalAndLearning'];

const IDDOCOperations = () => {
  const { t: iddocQuestionnaireT } = useTranslation('iddocQuestionnaire');

  const { t: iddocQuestionnaireMiscT } = useTranslation(
    'iddocQuestionnaireMisc'
  );
  const { t: additionalQuestionnairesT } = useTranslation(
    'additionalQuestionnaires'
  );

  const {
    technicalContactsIdentified: technicalContactsIdentifiedConfig,
    captureParticipantInfo: captureParticipantInfoConfig
  } = usePlanTranslation('opsEvalAndLearning');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<IDDOCFormType>>(null);
  const navigate = useNavigate();

  const { data, loading, error } = useGetIddocQuery({
    variables: {
      id: modelID
    }
  });

  const {
    id,
    iddocSupport,
    ccmInvolvment,
    dataNeededForMonitoring,
    technicalContactsIdentified,
    technicalContactsIdentifiedDetail,
    technicalContactsIdentifiedNote,
    captureParticipantInfo,
    captureParticipantInfoNote,
    icdOwner,
    draftIcdDueDate,
    icdNote
  } = (data?.modelPlan?.opsEvalAndLearning || {}) as IDDOCFormType;

  const { mutationError } = useHandleMutation(
    TypedUpdatePlanOpsEvalAndLearningDocument,
    {
      id,
      formikRef: formikRef as any
    }
  );

  const initialValues: IDDOCFormType = {
    __typename: 'PlanOpsEvalAndLearning',
    id: id ?? '',
    ccmInvolvment: ccmInvolvment ?? [],
    dataNeededForMonitoring: dataNeededForMonitoring ?? [],
    iddocSupport: iddocSupport ?? null,
    technicalContactsIdentified: technicalContactsIdentified ?? null,
    technicalContactsIdentifiedDetail: technicalContactsIdentifiedDetail ?? '',
    technicalContactsIdentifiedNote: technicalContactsIdentifiedNote ?? '',
    captureParticipantInfo: captureParticipantInfo ?? null,
    captureParticipantInfoNote: captureParticipantInfoNote ?? '',
    icdOwner: icdOwner ?? '',
    draftIcdDueDate: draftIcdDueDate ?? null,
    icdNote: icdNote ?? ''
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
            `/models/${modelID}/collaboration-area/additional-questionnaires/iddoc-questionnaire/testing`
          );
        }}
        enableReinitialize
        innerRef={formikRef}
        data-testid="ops-eval-and-learning-iddoc"
      >
        {(formikProps: FormikProps<IDDOCFormType>) => {
          const { handleSubmit, setFieldValue, values, setFieldError } =
            formikProps;

          const handleOnBlur = (
            e: React.ChangeEvent<HTMLInputElement>,
            field: string
          ) => {
            if (e.target.value === '') {
              setFieldValue(field, null);
              return;
            }
            try {
              setFieldValue(field, new Date(e.target.value).toISOString());
            } catch (err) {
              setFieldError(field, iddocQuestionnaireT('validDate'));
            }
          };

          return (
            <>
              <ConfirmLeave />

              <MINTForm
                className="desktop:grid-col-6 margin-top-0"
                data-testid="ops-eval-and-learning-iddoc-form"
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={!!error || loading}>
                  <h3>{iddocQuestionnaireMiscT('iddocHeading')}</h3>

                  <FieldGroup className="margin-y-4 margin-bottom-8">
                    <Label htmlFor="ops-eval-and-learning-technical-contacts-identified-use">
                      {iddocQuestionnaireT('technicalContactsIdentified.label')}
                    </Label>

                    <BooleanRadio
                      field="technicalContactsIdentified"
                      id="ops-eval-and-learning-technical-contacts-identified-use"
                      value={values.technicalContactsIdentified}
                      setFieldValue={setFieldValue}
                      options={technicalContactsIdentifiedConfig.options}
                      childName="technicalContactsIdentifiedDetail"
                    >
                      {values.technicalContactsIdentified === true ? (
                        <div className="margin-left-4 margin-top-1">
                          <Label
                            htmlFor="ops-eval-and-learning-technical-contacts-identified-detail"
                            className="text-normal"
                          >
                            {iddocQuestionnaireT(
                              'technicalContactsIdentifiedDetail.label'
                            )}
                          </Label>

                          <Field
                            as={TextAreaField}
                            id="ops-eval-and-learning-technical-contacts-identified-detail"
                            maxLength={5000}
                            className="mint-textarea"
                            name="technicalContactsIdentifiedDetail"
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                    </BooleanRadio>

                    <AddNote
                      id="ops-eval-and-learning-technical-contacts-identified-use-note"
                      field="technicalContactsIdentifiedNote"
                    />
                  </FieldGroup>

                  <FieldGroup className="margin-y-4 margin-bottom-8">
                    <Label htmlFor="ops-eval-and-learning-capture-participant-info">
                      {iddocQuestionnaireT('captureParticipantInfo.label')}
                    </Label>

                    <p className="text-base margin-bottom-1 margin-top-1">
                      {iddocQuestionnaireT('captureParticipantInfo.sublabel')}
                    </p>

                    <BooleanRadio
                      field="captureParticipantInfo"
                      id="ops-eval-and-learning-capture-participant-info"
                      value={values.captureParticipantInfo}
                      setFieldValue={setFieldValue}
                      options={captureParticipantInfoConfig.options}
                    />

                    <AddNote
                      id="ops-eval-and-learning-capture-participant-info-note"
                      field="captureParticipantInfoNote"
                    />
                  </FieldGroup>

                  <h3>{iddocQuestionnaireMiscT('icdHeading')}</h3>

                  <p className="margin-y-1 margin-top-2 line-height-body-4">
                    {iddocQuestionnaireMiscT('icdSubheading')}
                  </p>

                  <FieldGroup className="margin-top-4">
                    <Label htmlFor="ops-eval-and-learning-capture-icd-owner">
                      {iddocQuestionnaireT('icdOwner.label')}
                    </Label>

                    <Field
                      as={TextInput}
                      id="ops-eval-and-learning-capture-icd-owner"
                      data-testid="ops-eval-and-learning-capture-icd-owner"
                      maxLength={50}
                      name="icdOwner"
                    />
                  </FieldGroup>

                  {!loading && (
                    <>
                      <MINTDatePicker
                        fieldName="draftIcdDueDate"
                        id="ops-eval-and-learning-icd-due-date"
                        className="margin-top-6"
                        label={iddocQuestionnaireT('draftIcdDueDate.label')}
                        placeHolder
                        handleOnBlur={handleOnBlur}
                        formikValue={values.draftIcdDueDate}
                        value={draftIcdDueDate}
                        shouldShowWarning={
                          initialValues.draftIcdDueDate !==
                          values.draftIcdDueDate
                        }
                      />

                      <AddNote
                        id="ops-eval-and-learning-icd-due-date-note"
                        field="icdNote"
                      />
                    </>
                  )}

                  <FormFooter
                    homeArea={additionalQuestionnairesT(
                      'saveAndReturnToQuestionnaires'
                    )}
                    homeRoute={`/models/${modelID}/collaboration-area/additional-questionnaires`}
                    nextPage
                    disabled={!!error || loading} // TODO: add or replace with issubmitting once refactored form
                    id="iddoc-questionnaire-operations-form"
                  />
                </Fieldset>
              </MINTForm>
            </>
          );
        }}
      </Formik>

      <PageNumber currentPage={1} totalPages={3} className="margin-y-6" />
    </>
  );
};

export default IDDOCOperations;
