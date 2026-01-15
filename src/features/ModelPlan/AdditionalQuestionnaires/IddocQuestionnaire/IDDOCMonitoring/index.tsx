import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Fieldset, Label, Radio, TextInput } from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import { Field, Formik, FormikProps } from 'formik';
import {
  GetIddocMonitoringQuery,
  TypedUpdatePlanOpsEvalAndLearningDocument,
  useGetIddocMonitoringQuery
} from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import BooleanRadio from 'components/BooleanRadioForm';
import CheckboxField from 'components/CheckboxField';
import ConfirmLeave from 'components/ConfirmLeave';
import FieldGroup from 'components/FieldGroup';
import FormFooter from 'components/FormFooter';
import MINTForm from 'components/MINTForm';
import MutationErrorModal from 'components/MutationErrorModal';
import PageNumber from 'components/PageNumber';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import { formatDateLocal } from 'utils/date';

type IDDOCMonitoringFormType =
  GetIddocMonitoringQuery['modelPlan']['opsEvalAndLearning'];

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
    produceBenefitEnhancementFiles: produceBenefitEnhancementFilesConfig
  } = usePlanTranslation('iddocQuestionnaire');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<IDDOCMonitoringFormType>>(null);
  const navigate = useNavigate();

  const { data, loading, error } = useGetIddocMonitoringQuery({
    variables: {
      id: modelID
    }
  });

  const {
    id,
    iddocSupport,
    ccmInvolvment,
    dataNeededForMonitoring,
    dataFullTimeOrIncremental,
    eftSetUp,
    unsolicitedAdjustmentsIncluded,
    dataFlowDiagramsNeeded,
    produceBenefitEnhancementFiles,
    fileNamingConventions,
    dataMonitoringNote
  } = (data?.modelPlan?.opsEvalAndLearning || {}) as IDDOCMonitoringFormType;

  const { mutationError } = useHandleMutation(
    TypedUpdatePlanOpsEvalAndLearningDocument,
    {
      id,
      formikRef: formikRef as any
    }
  );

  const initialValues: IDDOCMonitoringFormType = {
    __typename: 'PlanOpsEvalAndLearning',
    id: id ?? '',
    ccmInvolvment: ccmInvolvment ?? [],
    dataNeededForMonitoring: dataNeededForMonitoring ?? [],
    iddocSupport: iddocSupport ?? null,
    dataFullTimeOrIncremental: dataFullTimeOrIncremental ?? null,
    eftSetUp: eftSetUp ?? null,
    unsolicitedAdjustmentsIncluded: unsolicitedAdjustmentsIncluded ?? null,
    dataFlowDiagramsNeeded: dataFlowDiagramsNeeded ?? null,
    produceBenefitEnhancementFiles: produceBenefitEnhancementFiles ?? null,
    fileNamingConventions: fileNamingConventions ?? '',
    dataMonitoringNote: dataMonitoringNote ?? ''
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
            `/models/${modelID}/collaboration-area/additional-questionnaires`
          );
        }}
        enableReinitialize
        innerRef={formikRef}
        data-testid="iddoc-questionnaire-monitoring"
      >
        {(formikProps: FormikProps<IDDOCMonitoringFormType>) => {
          const { handleSubmit, values, setFieldValue } = formikProps;

          return (
            <>
              <ConfirmLeave />

              <MINTForm
                className="desktop:grid-col-6 margin-top-0"
                data-testid="iddoc-questionnaire-monitoring-form"
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={!!error || loading}>
                  <h3>{iddocQuestionnaireMiscT('dataMonitoringContinued')}</h3>

                  <FieldGroup>
                    <Label htmlFor="iddoc-questionnaire-fulltime-or-incremental">
                      {iddocQuestionnaireT('dataFullTimeOrIncremental.label')}
                    </Label>

                    <Fieldset>
                      {getKeys(dataFullTimeOrIncrementalConfig.options).map(
                        key => (
                          <Field
                            as={Radio}
                            key={key}
                            id={`iddoc-questionnaire-fulltime-or-incremental-${key}`}
                            name="dataFullTimeOrIncremental"
                            label={dataFullTimeOrIncrementalConfig.options[key]}
                            value={key}
                            checked={values.dataFullTimeOrIncremental === key}
                            onChange={() => {
                              setFieldValue('dataFullTimeOrIncremental', key);
                            }}
                          />
                        )
                      )}
                    </Fieldset>
                  </FieldGroup>

                  <FieldGroup className="margin-top-6">
                    <Label htmlFor="iddoc-questionnaire-eft-setup">
                      {iddocQuestionnaireT('eftSetUp.label')}
                    </Label>

                    <BooleanRadio
                      field="eftSetUp"
                      id="iddoc-questionnaire-eft-setup"
                      value={values.eftSetUp}
                      setFieldValue={setFieldValue}
                      options={eftSetUpConfig.options}
                    />
                  </FieldGroup>

                  <FieldGroup className="margin-top-6">
                    <Label htmlFor="iddoc-questionnaire-unsolicited-adjustment-included">
                      {iddocQuestionnaireT(
                        'unsolicitedAdjustmentsIncluded.label'
                      )}
                    </Label>

                    <BooleanRadio
                      field="unsolicitedAdjustmentsIncluded"
                      id="iddoc-questionnaire-unsolicited-adjustment-included"
                      value={values.unsolicitedAdjustmentsIncluded}
                      setFieldValue={setFieldValue}
                      options={unsolicitedAdjustmentsIncludedConfig.options}
                    />
                  </FieldGroup>

                  <FieldGroup className="margin-top-6">
                    <Label htmlFor="iddoc-questionnaire-diagrams-needed">
                      {iddocQuestionnaireT('dataFlowDiagramsNeeded.label')}
                    </Label>

                    <BooleanRadio
                      field="dataFlowDiagramsNeeded"
                      id="iddoc-questionnaire-diagrams-needed"
                      value={values.dataFlowDiagramsNeeded}
                      setFieldValue={setFieldValue}
                      options={dataFlowDiagramsNeededConfig.options}
                    />
                  </FieldGroup>

                  <FieldGroup className="margin-top-6">
                    <Label htmlFor="iddoc-questionnaire-produce-benefit-files">
                      {iddocQuestionnaireT(
                        'produceBenefitEnhancementFiles.label'
                      )}
                    </Label>

                    <p className="text-base margin-y-1">
                      {iddocQuestionnaireT(
                        'produceBenefitEnhancementFiles.sublabel'
                      )}
                    </p>

                    <BooleanRadio
                      field="produceBenefitEnhancementFiles"
                      id="iddoc-questionnaire-produce-benefit-files"
                      value={values.produceBenefitEnhancementFiles}
                      setFieldValue={setFieldValue}
                      options={produceBenefitEnhancementFilesConfig.options}
                    />
                  </FieldGroup>

                  <FieldGroup className="margin-top-6">
                    <Label htmlFor="iddoc-questionnaire-file-naming-convention">
                      {iddocQuestionnaireT('fileNamingConventions.label')}
                    </Label>

                    <Field
                      as={TextInput}
                      id="iddoc-questionnaire-file-naming-convention"
                      data-testid="iddoc-questionnaire-file-naming-convention"
                      maxLength={50}
                      name="fileNamingConventions"
                    />
                  </FieldGroup>

                  <AddNote
                    id="iddoc-questionnaire-data-monitoring-note"
                    field="dataMonitoringNote"
                  />

                  {/* TODO: update below hard coded value once query is ready */}
                  <FieldGroup className="border-2px border-base-light radius-md padding-2">
                    <Label htmlFor="iddoc-questionnaire-is-complete">
                      Questionnaire status
                    </Label>
                    <CheckboxField
                      name="iddocQuestionnaireIsComplete"
                      id="iddoc-questionnaire-is-complete-true"
                      checked
                      value="true"
                      label="This questionnaire (4i and ACO-OS) is complete."
                      onChange={() => {}}
                      onBlur={() => {}}
                    />
                    {/* {formData.markedCompleteByUserAccount?.id && 
                    formData.markedCompleteDts && ( */}
                    <p className="margin-top-1 margin-bottom-0 margin-left-4 text-base">
                      {miscellaneousT('markedComplete', {
                        user: 'wonderful trouble maker'
                      })}
                      the best day ever{' '}
                      {formatDateLocal(
                        '2026-01-14T18:33:18.149679Z',
                        'MM/dd/yyyy'
                      )}
                    </p>
                    {/* )} */}
                  </FieldGroup>

                  <FormFooter
                    homeArea={additionalQuestionnairesT(
                      'saveAndReturnToQuestionnaires'
                    )}
                    homeRoute={`/models/${modelID}/collaboration-area/additional-questionnaires`}
                    backPage={`/models/${modelID}/collaboration-area/additional-questionnaires/iddoc-questionnaire/testing`}
                    nextPage={false}
                    disabled={!!error || loading} // TODO: add or replace with issubmitting once refactored form
                    id="iddoc-questionnaire-monitoring-form"
                  />
                </Fieldset>
              </MINTForm>
            </>
          );
        }}
      </Formik>

      <PageNumber currentPage={3} totalPages={3} className="margin-y-6" />
    </>
  );
};

export default IDDOCMonitoring;
