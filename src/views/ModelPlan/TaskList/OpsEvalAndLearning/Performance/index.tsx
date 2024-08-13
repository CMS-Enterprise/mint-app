import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Fieldset, Icon, Label, Radio } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  GetPerformanceQuery,
  TypedUpdatePlanOpsEvalAndLearningDocument,
  useGetPerformanceQuery
} from 'gql/gen/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import ITSolutionsWarning from 'components/ITSolutionsWarning';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import Alert from 'components/shared/Alert';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import useScrollElement from 'hooks/useScrollElement';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { NotFoundPartial } from 'views/NotFound';

import {
  isCCWInvolvement,
  isQualityMeasures,
  renderCurrentPage,
  renderTotalPages
} from '..';

type PerformanceFormType = GetPerformanceQuery['modelPlan']['opsEvalAndLearning'];

const Performance = () => {
  const { t: opsEvalAndLearningT } = useTranslation('opsEvalAndLearning');

  const { t: opsEvalAndLearningMiscT } = useTranslation(
    'opsEvalAndLearningMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    benchmarkForPerformance: benchmarkForPerformanceConfig,
    computePerformanceScores: computePerformanceScoresConfig,
    riskAdjustPerformance: riskAdjustPerformanceConfig,
    riskAdjustFeedback: riskAdjustFeedbackConfig,
    riskAdjustPayments: riskAdjustPaymentsConfig,
    riskAdjustOther: riskAdjustOtherConfig,
    appealPerformance: appealPerformanceConfig,
    appealFeedback: appealFeedbackConfig,
    appealPayments: appealPaymentsConfig,
    appealOther: appealOtherConfig
  } = usePlanTranslation('opsEvalAndLearning');

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<PerformanceFormType>>(null);

  const history = useHistory();

  const { data, loading, error } = useGetPerformanceQuery({
    variables: {
      id: modelID
    }
  });

  const {
    id,
    iddocSupport,
    ccmInvolvment,
    dataNeededForMonitoring,
    benchmarkForPerformance,
    benchmarkForPerformanceNote,
    computePerformanceScores,
    computePerformanceScoresNote,
    riskAdjustPerformance,
    riskAdjustFeedback,
    riskAdjustPayments,
    riskAdjustOther,
    riskAdjustNote,
    appealPerformance,
    appealFeedback,
    appealPayments,
    appealOther,
    appealNote
  } = (data?.modelPlan?.opsEvalAndLearning || {}) as PerformanceFormType;

  const modelName = data?.modelPlan?.modelName || '';

  const itSolutionsStarted: boolean = !!data?.modelPlan.operationalNeeds.find(
    need => need.modifiedDts
  );

  // If redirected from Operational Solutions, scrolls to the relevant question
  useScrollElement(!loading);

  const { mutationError } = useHandleMutation(
    TypedUpdatePlanOpsEvalAndLearningDocument,
    {
      id,
      formikRef
    }
  );

  const backPage = () => {
    if (iddocSupport) {
      history.push(
        `/models/${modelID}/task-list/ops-eval-and-learning/iddoc-monitoring`
      );
    } else {
      history.push(`/models/${modelID}/task-list/ops-eval-and-learning`);
    }
  };

  const initialValues: PerformanceFormType = {
    __typename: 'PlanOpsEvalAndLearning',
    id: id ?? '',
    ccmInvolvment: ccmInvolvment ?? [],
    dataNeededForMonitoring: dataNeededForMonitoring ?? [],
    iddocSupport: iddocSupport ?? null,
    benchmarkForPerformance: benchmarkForPerformance ?? null,
    benchmarkForPerformanceNote: benchmarkForPerformanceNote ?? '',
    computePerformanceScores: computePerformanceScores ?? null,
    computePerformanceScoresNote: computePerformanceScoresNote ?? '',
    riskAdjustPerformance: riskAdjustPerformance ?? null,
    riskAdjustFeedback: riskAdjustFeedback ?? null,
    riskAdjustPayments: riskAdjustPayments ?? null,
    riskAdjustOther: riskAdjustOther ?? null,
    riskAdjustNote: riskAdjustNote ?? '',
    appealPerformance: appealPerformance ?? null,
    appealFeedback: appealFeedback ?? null,
    appealPayments: appealPayments ?? null,
    appealOther: appealOther ?? null,
    appealNote: appealNote ?? ''
  };

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  return (
    <>
      <MutationErrorModal
        isOpen={mutationError.isModalOpen}
        closeModal={() => mutationError.setIsModalOpen(false)}
        url={mutationError.destinationURL}
      />

      <Breadcrumbs
        items={[
          BreadcrumbItemOptions.HOME,
          BreadcrumbItemOptions.COLLABORATION_AREA,
          BreadcrumbItemOptions.TASK_LIST,
          BreadcrumbItemOptions.OPS_EVAL_AND_LEARNING
        ]}
      />

      <PageHeading className="margin-top-4 margin-bottom-2">
        {opsEvalAndLearningMiscT('heading')}
      </PageHeading>

      <p
        className="margin-top-0 margin-bottom-1 font-body-lg"
        data-testid="model-plan-name"
      >
        {miscellaneousT('for')} {modelName}
      </p>

      <p className="margin-bottom-2 font-body-md line-height-sans-4">
        {miscellaneousT('helpText')}
      </p>

      <AskAQuestion modelID={modelID} />

      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          history.push(
            `/models/${modelID}/task-list/ops-eval-and-learning/evaluation`
          );
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<PerformanceFormType>) => {
          const {
            errors,
            handleSubmit,
            setErrors,
            values,
            setFieldValue
          } = formikProps;
          const flatErrors = flattenErrors(errors);

          return (
            <>
              {getKeys(errors).length > 0 && (
                <ErrorAlert
                  testId="formik-validation-errors"
                  classNames="margin-top-3"
                  heading={miscellaneousT('checkAndFix')}
                >
                  {getKeys(flatErrors).map(key => {
                    return (
                      <ErrorAlertMessage
                        key={`Error.${key}`}
                        errorKey={`${key}`}
                        message={flatErrors[key]}
                      />
                    );
                  })}
                </ErrorAlert>
              )}

              <ConfirmLeave />

              <Form
                className="desktop:grid-col-6 margin-top-6"
                data-testid="ops-eval-and-learning-performance-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={!!error || loading}>
                  <FieldGroup
                    scrollElement="benchmarkForPerformance"
                    error={!!flatErrors.benchmarkForPerformance}
                  >
                    <Label htmlFor="ops-eval-and-learning-benchmark-performance">
                      {opsEvalAndLearningT('benchmarkForPerformance.label')}
                    </Label>

                    {itSolutionsStarted && (
                      <ITSolutionsWarning
                        id="ops-eval-and-learning-benchmark-performance-warning"
                        onClick={() =>
                          history.push(
                            `/models/${modelID}/task-list/it-solutions`
                          )
                        }
                      />
                    )}

                    <FieldErrorMsg>
                      {flatErrors.benchmarkForPerformance}
                    </FieldErrorMsg>

                    <Fieldset>
                      {getKeys(benchmarkForPerformanceConfig.options).map(
                        key => (
                          <Field
                            as={Radio}
                            key={key}
                            id={`ops-eval-and-learning-benchmark-performance-${key}`}
                            name="dataFullTimeOrIncremental"
                            label={benchmarkForPerformanceConfig.options[key]}
                            value={key}
                            checked={values.benchmarkForPerformance === key}
                            onChange={() => {
                              setFieldValue('benchmarkForPerformance', key);
                            }}
                          />
                        )
                      )}
                    </Fieldset>

                    <AddNote
                      id="ops-eval-and-learning-benchmark-performance-note"
                      field="benchmarkForPerformanceNote"
                    />
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="computePerformanceScores"
                    error={!!flatErrors.computePerformanceScores}
                    className="margin-top-6"
                  >
                    <Label htmlFor="ops-eval-and-learning-compute-performance">
                      {opsEvalAndLearningT('computePerformanceScores.label')}
                    </Label>

                    <FieldErrorMsg>
                      {flatErrors.computePerformanceScores}
                    </FieldErrorMsg>

                    <BooleanRadio
                      field="computePerformanceScores"
                      id="ops-eval-and-learning-compute-performance"
                      value={values.computePerformanceScores}
                      setFieldValue={setFieldValue}
                      options={computePerformanceScoresConfig.options}
                    />

                    <AddNote
                      id="ops-eval-and-learning-compute-performance-note"
                      field="computePerformanceScoresNote"
                    />
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="riskAdjustPerformance"
                    error={!!flatErrors.riskAdjustPerformance}
                    className="margin-top-6"
                  >
                    <Label htmlFor="ops-eval-and-learning-risk-adjustments">
                      {opsEvalAndLearningMiscT('riskAdjustments')}
                    </Label>

                    <Label
                      htmlFor="ops-eval-and-learning-risk-adjustment-performance"
                      className="text-normal margin-top-2"
                    >
                      {opsEvalAndLearningT('riskAdjustPerformance.label')}
                    </Label>

                    <FieldErrorMsg>
                      {flatErrors.riskAdjustPerformance}
                    </FieldErrorMsg>

                    <BooleanRadio
                      field="riskAdjustPerformance"
                      id="ops-eval-and-learning-risk-adjustment-performance"
                      value={values.riskAdjustPerformance}
                      setFieldValue={setFieldValue}
                      options={riskAdjustPerformanceConfig.options}
                    />

                    <Label
                      htmlFor="ops-eval-and-learning-risk-adjustment-feedback"
                      className="text-normal"
                    >
                      {opsEvalAndLearningT('riskAdjustFeedback.label')}
                    </Label>

                    <FieldErrorMsg>
                      {flatErrors.riskAdjustFeedback}
                    </FieldErrorMsg>

                    <BooleanRadio
                      field="riskAdjustFeedback"
                      id="ops-eval-and-learning-risk-adjustment-feedback"
                      value={values.riskAdjustFeedback}
                      setFieldValue={setFieldValue}
                      options={riskAdjustFeedbackConfig.options}
                    />

                    <Label
                      htmlFor="ops-eval-and-learning-risk-adjustment-payment"
                      className="text-normal"
                    >
                      {opsEvalAndLearningT('riskAdjustPayments.label')}
                    </Label>

                    <FieldErrorMsg>
                      {flatErrors.riskAdjustPayments}
                    </FieldErrorMsg>

                    <BooleanRadio
                      field="riskAdjustPayments"
                      id="ops-eval-and-learning-risk-adjustment-payment"
                      value={values.riskAdjustPayments}
                      setFieldValue={setFieldValue}
                      options={riskAdjustPaymentsConfig.options}
                    />

                    <Label
                      htmlFor="ops-eval-and-learning-risk-adjustment-other"
                      className="text-normal"
                    >
                      {opsEvalAndLearningT('riskAdjustOther.label')}
                    </Label>

                    <FieldErrorMsg>{flatErrors.riskAdjustOther}</FieldErrorMsg>

                    <BooleanRadio
                      field="riskAdjustOther"
                      id="ops-eval-and-learning-risk-adjustment-other"
                      value={values.riskAdjustOther}
                      setFieldValue={setFieldValue}
                      options={riskAdjustOtherConfig.options}
                    />

                    <AddNote
                      id="ops-eval-and-learning-risk-adjustment-note"
                      field="riskAdjustNote"
                    />
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="appealPerformance"
                    error={!!flatErrors.appealPerformance}
                    className="margin-top-6"
                  >
                    <Label htmlFor="ops-eval-and-learning-appeals">
                      {opsEvalAndLearningMiscT('participantAppeal')}
                    </Label>

                    {itSolutionsStarted && (
                      <ITSolutionsWarning
                        id="ops-eval-and-learning-appeal-performance-warning"
                        onClick={() =>
                          history.push(
                            `/models/${modelID}/task-list/it-solutions`
                          )
                        }
                        className="margin-top-2"
                      />
                    )}

                    <Alert slim type="info">
                      {opsEvalAndLearningMiscT('appealsWarning')}
                    </Alert>

                    <Label
                      htmlFor="ops-eval-and-learning-appeal-performance"
                      className="text-normal margin-top-2"
                    >
                      {opsEvalAndLearningT('appealPerformance.label')}
                    </Label>

                    <FieldErrorMsg>
                      {flatErrors.appealPerformance}
                    </FieldErrorMsg>

                    <BooleanRadio
                      field="appealPerformance"
                      id="ops-eval-and-learning-appeal-performance"
                      value={values.appealPerformance}
                      setFieldValue={setFieldValue}
                      options={appealPerformanceConfig.options}
                    />

                    <Label
                      htmlFor="ops-eval-and-learning-appeal-feedback"
                      className="text-normal"
                    >
                      {opsEvalAndLearningT('appealFeedback.label')}
                    </Label>

                    <FieldErrorMsg>{flatErrors.appealFeedback}</FieldErrorMsg>

                    <BooleanRadio
                      field="appealFeedback"
                      id="ops-eval-and-learning-appeal-feedback"
                      value={values.appealFeedback}
                      setFieldValue={setFieldValue}
                      options={appealFeedbackConfig.options}
                    />

                    <Label
                      htmlFor="ops-eval-and-learning-appeal-payment"
                      className="text-normal"
                    >
                      {opsEvalAndLearningT('appealPayments.label')}
                    </Label>

                    <FieldErrorMsg>{flatErrors.appealPayments}</FieldErrorMsg>

                    <BooleanRadio
                      field="appealPayments"
                      id="ops-eval-and-learning-appeal-payment"
                      value={values.appealPayments}
                      setFieldValue={setFieldValue}
                      options={appealPaymentsConfig.options}
                    />

                    <Label
                      htmlFor="ops-eval-and-learning-appeal-other"
                      className="text-normal"
                    >
                      {opsEvalAndLearningT('appealOther.label')}
                    </Label>

                    <FieldErrorMsg>{flatErrors.appealOther}</FieldErrorMsg>

                    <BooleanRadio
                      field="appealOther"
                      id="ops-eval-and-learning-appeal-other"
                      value={values.appealOther}
                      setFieldValue={setFieldValue}
                      options={appealOtherConfig.options}
                    />

                    <AddNote
                      id="ops-eval-and-learning-appeal-note"
                      field="appealNote"
                    />
                  </FieldGroup>

                  <div className="margin-top-6 margin-bottom-3">
                    <Button
                      type="button"
                      className="usa-button usa-button--outline margin-bottom-1"
                      onClick={() => {
                        backPage();
                      }}
                    >
                      {miscellaneousT('back')}
                    </Button>

                    <Button type="submit" onClick={() => setErrors({})}>
                      {miscellaneousT('next')}
                    </Button>
                  </div>

                  <Button
                    type="button"
                    className="usa-button usa-button--unstyled"
                    onClick={() => history.push(`/models/${modelID}/task-list`)}
                  >
                    <Icon.ArrowBack className="margin-right-1" aria-hidden />

                    {miscellaneousT('saveAndReturn')}
                  </Button>
                </Fieldset>
              </Form>
            </>
          );
        }}
      </Formik>

      {data && (
        <PageNumber
          currentPage={renderCurrentPage(
            5,
            iddocSupport,
            isCCWInvolvement(ccmInvolvment) ||
              isQualityMeasures(dataNeededForMonitoring)
          )}
          totalPages={renderTotalPages(
            iddocSupport,
            isCCWInvolvement(ccmInvolvment) ||
              isQualityMeasures(dataNeededForMonitoring)
          )}
          className="margin-y-6"
        />
      )}
    </>
  );
};

export default Performance;
