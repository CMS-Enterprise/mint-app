import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Fieldset,
  IconArrowBack,
  Label,
  Radio
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import ITToolsWarning from 'components/ITSolutionsWarning';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import Alert from 'components/shared/Alert';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import useScrollElement from 'hooks/useScrollElement';
import GetPerformance from 'queries/OpsEvalAndLearning/GetPerformance';
import {
  GetPerformance as GetPerformanceType,
  GetPerformance_modelPlan_opsEvalAndLearning as PerformanceFormType,
  GetPerformanceVariables
} from 'queries/OpsEvalAndLearning/types/GetPerformance';
import { UpdatePlanOpsEvalAndLearningVariables } from 'queries/OpsEvalAndLearning/types/UpdatePlanOpsEvalAndLearning';
import UpdatePlanOpsEvalAndLearning from 'queries/OpsEvalAndLearning/UpdatePlanOpsEvalAndLearning';
import { BenchmarkForPerformanceType } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import {
  sortOtherEnum,
  translateBenchmarkForPerformanceType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import {
  isCCWInvolvement,
  isQualityMeasures,
  renderCurrentPage,
  renderTotalPages
} from '..';

const Performance = () => {
  const { t } = useTranslation('operationsEvaluationAndLearning');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<PerformanceFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetPerformanceType,
    GetPerformanceVariables
  >(GetPerformance, {
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
  } = data?.modelPlan?.opsEvalAndLearning || ({} as PerformanceFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const itSolutionsStarted: boolean = !!data?.modelPlan.operationalNeeds.find(
    need => need.modifiedDts
  );

  // If redirected from IT Solutions, scrolls to the relevant question
  useScrollElement(!loading);

  const [update] = useMutation<UpdatePlanOpsEvalAndLearningVariables>(
    UpdatePlanOpsEvalAndLearning
  );

  const handleFormSubmit = (
    redirect?: 'next' | 'back' | 'task-list' | string
  ) => {
    update({
      variables: {
        id,
        changes: dirtyInput(
          formikRef?.current?.initialValues,
          formikRef?.current?.values
        )
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (redirect === 'next') {
            history.push(
              `/models/${modelID}/task-list/ops-eval-and-learning/evaluation`
            );
          } else if (redirect === 'back') {
            if (iddocSupport) {
              history.push(
                `/models/${modelID}/task-list/ops-eval-and-learning/iddoc-monitoring`
              );
            } else {
              history.push(
                `/models/${modelID}/task-list/ops-eval-and-learning`
              );
            }
          } else if (redirect === 'task-list') {
            history.push(`/models/${modelID}/task-list`);
          } else if (redirect) {
            history.push(redirect);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
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
      <BreadcrumbBar variant="wrap">
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to="/">
            <span>{h('home')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to={`/models/${modelID}/task-list/`}>
            <span>{h('tasklistBreadcrumb')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>{t('breadcrumb')}</Breadcrumb>
      </BreadcrumbBar>
      <PageHeading className="margin-top-4 margin-bottom-2">
        {t('heading')}
      </PageHeading>

      <p
        className="margin-top-0 margin-bottom-1 font-body-lg"
        data-testid="model-plan-name"
      >
        {h('for')} {modelName}
      </p>
      <p className="margin-bottom-2 font-body-md line-height-sans-4">
        {h('helpText')}
      </p>

      <AskAQuestion modelID={modelID} />

      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          handleFormSubmit('next');
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
              {Object.keys(errors).length > 0 && (
                <ErrorAlert
                  testId="formik-validation-errors"
                  classNames="margin-top-3"
                  heading={h('checkAndFix')}
                >
                  {Object.keys(flatErrors).map(key => {
                    return (
                      <ErrorAlertMessage
                        key={`Error.${key}`}
                        errorKey={key}
                        message={flatErrors[key]}
                      />
                    );
                  })}
                </ErrorAlert>
              )}

              <Form
                className="desktop:grid-col-6 margin-top-6"
                data-testid="ops-eval-and-learning-performance-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <FieldGroup
                  scrollElement="benchmarkForPerformance"
                  error={!!flatErrors.benchmarkForPerformance}
                >
                  <Label htmlFor="ops-eval-and-learning-benchmark-performance">
                    {t('establishBenchmark')}
                  </Label>
                  {itSolutionsStarted && (
                    <ITToolsWarning
                      id="ops-eval-and-learning-benchmark-performance-warning"
                      onClick={() =>
                        handleFormSubmit(
                          `/models/${modelID}/task-list/it-solutions`
                        )
                      }
                    />
                  )}
                  <FieldErrorMsg>
                    {flatErrors.benchmarkForPerformance}
                  </FieldErrorMsg>
                  <Fieldset>
                    {Object.keys(BenchmarkForPerformanceType)
                      .sort(sortOtherEnum)
                      .map(key => (
                        <Field
                          as={Radio}
                          key={key}
                          id={`ops-eval-and-learning-benchmark-performance-${key}`}
                          name="dataFullTimeOrIncremental"
                          label={translateBenchmarkForPerformanceType(key)}
                          value={key}
                          checked={values.benchmarkForPerformance === key}
                          onChange={() => {
                            setFieldValue('benchmarkForPerformance', key);
                          }}
                        />
                      ))}
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
                    {t('computeScores')}
                  </Label>

                  <FieldErrorMsg>
                    {flatErrors.computePerformanceScores}
                  </FieldErrorMsg>
                  <Fieldset>
                    {[true, false].map(key => (
                      <Field
                        as={Radio}
                        key={key}
                        id={`ops-eval-and-learning-compute-performance-${key}`}
                        data-testid={`ops-eval-and-learning-compute-performance-${key}`}
                        name="computePerformanceScores"
                        label={key ? h('yes') : h('no')}
                        value={key ? 'YES' : 'NO'}
                        checked={values.computePerformanceScores === key}
                        onChange={() => {
                          setFieldValue('computePerformanceScores', key);
                        }}
                      />
                    ))}
                  </Fieldset>

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
                    {t('riskAdjustments')}
                  </Label>

                  <Label
                    htmlFor="ops-eval-and-learning-risk-adjustment-performance"
                    className="text-normal margin-top-2"
                  >
                    {t('performanceScores')}
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors.riskAdjustPerformance}
                  </FieldErrorMsg>
                  <Fieldset>
                    {[true, false].map(key => (
                      <Field
                        as={Radio}
                        key={key}
                        id={`ops-eval-and-learning-risk-adjustment-performance-${key}`}
                        name="riskAdjustPerformance"
                        label={key ? h('yes') : h('no')}
                        value={key ? 'YES' : 'NO'}
                        checked={values.riskAdjustPerformance === key}
                        onChange={() => {
                          setFieldValue('riskAdjustPerformance', key);
                        }}
                      />
                    ))}
                  </Fieldset>

                  <Label
                    htmlFor="ops-eval-and-learning-risk-adjustment-feedback"
                    className="text-normal"
                  >
                    {t('feedbackResults')}
                  </Label>
                  <FieldErrorMsg>{flatErrors.riskAdjustFeedback}</FieldErrorMsg>
                  <Fieldset>
                    {[true, false].map(key => (
                      <Field
                        as={Radio}
                        key={key}
                        id={`ops-eval-and-learning-risk-adjustment-feedback-${key}`}
                        name="riskAdjustFeedback"
                        label={key ? h('yes') : h('no')}
                        value={key ? 'YES' : 'NO'}
                        checked={values.riskAdjustFeedback === key}
                        onChange={() => {
                          setFieldValue('riskAdjustFeedback', key);
                        }}
                      />
                    ))}
                  </Fieldset>

                  <Label
                    htmlFor="ops-eval-and-learning-risk-adjustment-payment"
                    className="text-normal"
                  >
                    {t('payments')}
                  </Label>
                  <FieldErrorMsg>{flatErrors.riskAdjustPayments}</FieldErrorMsg>
                  <Fieldset>
                    {[true, false].map(key => (
                      <Field
                        as={Radio}
                        key={key}
                        id={`ops-eval-and-learning-risk-adjustment-payment-${key}`}
                        name="riskAdjustPayments"
                        label={key ? h('yes') : h('no')}
                        value={key ? 'YES' : 'NO'}
                        checked={values.riskAdjustPayments === key}
                        onChange={() => {
                          setFieldValue('riskAdjustPayments', key);
                        }}
                      />
                    ))}
                  </Fieldset>

                  <Label
                    htmlFor="ops-eval-and-learning-risk-adjustment-other"
                    className="text-normal"
                  >
                    {t('others')}
                  </Label>
                  <FieldErrorMsg>{flatErrors.riskAdjustOther}</FieldErrorMsg>
                  <Fieldset>
                    {[true, false].map(key => (
                      <Field
                        as={Radio}
                        key={key}
                        id={`ops-eval-and-learning-risk-adjustment-other-${key}`}
                        name="riskAdjustOther"
                        label={key ? h('yes') : h('no')}
                        value={key ? 'YES' : 'NO'}
                        checked={values.riskAdjustOther === key}
                        onChange={() => {
                          setFieldValue('riskAdjustOther', key);
                        }}
                      />
                    ))}
                  </Fieldset>

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
                    {t('participantAppeal')}
                  </Label>

                  {itSolutionsStarted && (
                    <ITToolsWarning
                      id="ops-eval-and-learning-appeal-performance-warning"
                      onClick={() =>
                        handleFormSubmit(
                          `/models/${modelID}/task-list/it-solutions`
                        )
                      }
                      className="margin-top-2"
                    />
                  )}

                  <Alert slim type="info">
                    {t('appealsWarning')}
                  </Alert>

                  <Label
                    htmlFor="ops-eval-and-learning-appeal-performance"
                    className="text-normal margin-top-2"
                  >
                    {t('performanceScores')}
                  </Label>
                  <FieldErrorMsg>{flatErrors.appealPerformance}</FieldErrorMsg>
                  <Fieldset>
                    {[true, false].map(key => (
                      <Field
                        as={Radio}
                        key={key}
                        id={`ops-eval-and-learning-appeal-performance-${key}`}
                        name="appealPerformance"
                        label={key ? h('yes') : h('no')}
                        value={key ? 'YES' : 'NO'}
                        checked={values.appealPerformance === key}
                        onChange={() => {
                          setFieldValue('appealPerformance', key);
                        }}
                      />
                    ))}
                  </Fieldset>

                  <Label
                    htmlFor="ops-eval-and-learning-appeal-feedback"
                    className="text-normal"
                  >
                    {t('feedbackResults')}
                  </Label>
                  <FieldErrorMsg>{flatErrors.appealFeedback}</FieldErrorMsg>
                  <Fieldset>
                    {[true, false].map(key => (
                      <Field
                        as={Radio}
                        key={key}
                        id={`ops-eval-and-learning-appeal-feedback-${key}`}
                        name="appealFeedback"
                        label={key ? h('yes') : h('no')}
                        value={key ? 'YES' : 'NO'}
                        checked={values.appealFeedback === key}
                        onChange={() => {
                          setFieldValue('appealFeedback', key);
                        }}
                      />
                    ))}
                  </Fieldset>

                  <Label
                    htmlFor="ops-eval-and-learning-appeal-payment"
                    className="text-normal"
                  >
                    {t('payments')}
                  </Label>
                  <FieldErrorMsg>{flatErrors.appealPayments}</FieldErrorMsg>
                  <Fieldset>
                    {[true, false].map(key => (
                      <Field
                        as={Radio}
                        key={key}
                        id={`ops-eval-and-learning-appeal-payment-${key}`}
                        name="appealPayments"
                        label={key ? h('yes') : h('no')}
                        value={key ? 'YES' : 'NO'}
                        checked={values.appealPayments === key}
                        onChange={() => {
                          setFieldValue('appealPayments', key);
                        }}
                      />
                    ))}
                  </Fieldset>

                  <Label
                    htmlFor="ops-eval-and-learning-appeal-other"
                    className="text-normal"
                  >
                    {t('others')}
                  </Label>
                  <FieldErrorMsg>{flatErrors.appealOther}</FieldErrorMsg>
                  <Fieldset>
                    {[true, false].map(key => (
                      <Field
                        as={Radio}
                        key={key}
                        id={`ops-eval-and-learning-appeal-other-${key}`}
                        name="appealOther"
                        label={key ? h('yes') : h('no')}
                        value={key ? 'YES' : 'NO'}
                        checked={values.appealOther === key}
                        onChange={() => {
                          setFieldValue('appealOther', key);
                        }}
                      />
                    ))}
                  </Fieldset>

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
                      handleFormSubmit('back');
                    }}
                  >
                    {h('back')}
                  </Button>
                  <Button type="submit" onClick={() => setErrors({})}>
                    {h('next')}
                  </Button>
                </div>
                <Button
                  type="button"
                  className="usa-button usa-button--unstyled"
                  onClick={() => handleFormSubmit('task-list')}
                >
                  <IconArrowBack className="margin-right-1" aria-hidden />
                  {h('saveAndReturn')}
                </Button>
              </Form>

              {id && (
                <AutoSave
                  values={values}
                  onSave={() => {
                    handleFormSubmit();
                  }}
                  debounceDelay={3000}
                />
              )}
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
