import React, { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Fieldset,
  Grid,
  IconArrowBack
} from '@trussworks/react-uswds';
import { Form, Formik, FormikProps } from 'formik';

import AskAQuestion from 'components/AskAQuestion';
import ITToolsSummary from 'components/ITToolsSummary';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import GetITToolsPageFive from 'queries/ITTools/GetITToolsPageFive';
import {
  GetITToolPageFive as GetITToolPageFiveType,
  GetITToolPageFive_modelPlan as ModelPlanType,
  GetITToolPageFive_modelPlan_itTools as ITToolsPageFiveFormType,
  GetITToolPageFive_modelPlan_opsEvalAndLearning as OpsEvalAndLearningType,
  GetITToolPageFiveVariables
} from 'queries/ITTools/types/GetITToolPageFive';
import { UpdatePlanItToolsVariables } from 'queries/ITTools/types/UpdatePlanItTools';
import UpdatePlanITTools from 'queries/ITTools/UpdatePlanItTools';
import {
  DataForMonitoringType,
  EvaluationApproachType,
  OelCollectDataType,
  OelEvaluationContractorType,
  OelProcessAppealsType
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import {
  translateDataForMonitoringType,
  translateEvaluationApproachType,
  translateOelCollectDataType,
  translateOelEvaluationContractorType,
  translateOelProcessAppealsType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import { ITToolsFormComponent } from '..';

const initialFormValues: ITToolsPageFiveFormType = {
  __typename: 'PlanITTools',
  id: '',
  oelProcessAppeals: [],
  oelProcessAppealsOther: '',
  oelProcessAppealsNote: '',
  oelEvaluationContractor: [],
  oelEvaluationContractorOther: '',
  oelEvaluationContractorNote: '',
  oelCollectData: [],
  oelCollectDataOther: '',
  oelCollectDataNote: ''
};

const initialOpsEvalAndLearningValues: OpsEvalAndLearningType = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '',
  appealPerformance: null,
  appealFeedback: null,
  appealPayments: null,
  appealOther: null,
  evaluationApproaches: [],
  dataNeededForMonitoring: []
};

const initialModelPlanValues: ModelPlanType = {
  __typename: 'ModelPlan',
  id: '',
  modelName: '',
  opsEvalAndLearning: initialOpsEvalAndLearningValues,
  itTools: initialFormValues
};

const ITToolsPageFive = () => {
  const { t } = useTranslation('itTools');
  const { t: o } = useTranslation('operationsEvaluationAndLearning');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();
  const formikRef = useRef<FormikProps<ITToolsPageFiveFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetITToolPageFiveType,
    GetITToolPageFiveVariables
  >(GetITToolsPageFive, {
    variables: {
      id: modelID
    }
  });

  const modelPlan = data?.modelPlan || initialModelPlanValues;

  const {
    modelName,
    itTools,
    opsEvalAndLearning: {
      appealPerformance,
      appealFeedback,
      appealPayments,
      appealOther,
      evaluationApproaches,
      dataNeededForMonitoring
    }
  } = modelPlan;

  /**
   * Identifying if each question requires tooling as well as rending answers
   * Checkbox answers will not be checked despite a store truthy boolean
   * 'Specify other' answer will not be rendered even if OTHER value is true
   */
  const questionOneNeedsTools: boolean =
    appealPerformance! || appealFeedback! || appealPayments! || appealOther!;
  const questionTwoNeedsTools: boolean =
    evaluationApproaches.includes(
      EvaluationApproachType.CONTROL_INTERVENTION
    ) ||
    evaluationApproaches.includes(EvaluationApproachType.COMPARISON_MATCH) ||
    evaluationApproaches.includes(EvaluationApproachType.INTERRUPTED_TIME) ||
    evaluationApproaches.includes(EvaluationApproachType.NON_MEDICARE_DATA);
  const questionThreeNeedsTools: boolean =
    dataNeededForMonitoring.length > 0 &&
    !dataNeededForMonitoring.includes(
      DataForMonitoringType.NOT_PLANNING_TO_COLLECT_DATA
    );

  const [update] = useMutation<UpdatePlanItToolsVariables>(UpdatePlanITTools);

  const handleFormSubmit = (
    formikValues: ITToolsPageFiveFormType,
    redirect?: 'next' | 'back' | 'task-list'
  ) => {
    const { id, __typename, ...changes } = formikValues;
    update({
      variables: {
        id,
        changes
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (redirect === 'next') {
            history.push(`/models/${modelID}/task-list/it-tools/page-six`);
          } else if (redirect === 'back') {
            history.push(`/models/${modelID}/task-list/it-tools/page-four`);
          } else if (redirect === 'task-list') {
            history.push(`/models/${modelID}/task-list`);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  if ((!loading && error) || (!loading && !modelPlan)) {
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
        <Trans i18nKey="modelPlanTaskList:subheading">
          indexZero {modelName} indexTwo
        </Trans>
      </p>
      <p className="margin-bottom-2 font-body-md line-height-sans-4">
        {t('subheading')}
      </p>

      <AskAQuestion modelID={modelID} />

      <Formik
        initialValues={itTools}
        onSubmit={values => {
          handleFormSubmit(values, 'next');
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<ITToolsPageFiveFormType>) => {
          const { errors, handleSubmit, setErrors, values } = formikProps;
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

              <Grid row gap>
                <Grid desktop={{ col: 6 }}>
                  <Form
                    className="margin-top-6"
                    data-testid="oit-tools-page-five-form"
                    onSubmit={e => {
                      handleSubmit(e);
                    }}
                  >
                    <Fieldset disabled={loading}>
                      {/* Question One: Participants will be able to appeal the following */}
                      <FieldGroup
                        scrollElement="oelProcessAppeals"
                        error={!!flatErrors.oelProcessAppeals}
                        className="margin-y-0"
                      >
                        <legend className="usa-label">
                          {t('appealTools')}
                        </legend>
                        <p className="text-base margin-top-1 margin-bottom-3 line-height-body-3">
                          {t('appealToolsInfo')}
                        </p>
                        <FieldErrorMsg>
                          {flatErrors.oelProcessAppeals}
                        </FieldErrorMsg>

                        <ITToolsSummary
                          question={t('participantAppeal')}
                          answers={[
                            appealPerformance !== null
                              ? o('performanceScores')
                              : '',
                            appealFeedback !== null ? o('feedbackResults') : '',
                            appealPayments !== null ? o('payments') : '',
                            appealOther !== null ? o('Others') : ''
                          ].filter(appeal => appeal !== '')}
                          redirect={`/models/${modelID}/task-list/ops-eval-and-learning/performance`}
                          answered={
                            appealPerformance !== null ||
                            appealFeedback !== null ||
                            appealPayments !== null ||
                            appealOther !== null
                          }
                          needsTool={questionOneNeedsTools}
                          subtext={t('appealsNeedsAnswer')}
                          scrollElememnt="appealPerformance"
                        />

                        <ITToolsFormComponent
                          flatErrors={flatErrors}
                          formikValue={values.oelProcessAppeals}
                          fieldName="oelProcessAppeals"
                          needsTool={questionOneNeedsTools}
                          htmlID="oel-process-appeals"
                          EnumType={OelProcessAppealsType}
                          translation={translateOelProcessAppealsType}
                        />
                      </FieldGroup>

                      {/* Question Two: What type of evaluation approach are you considering?  */}

                      <FieldGroup
                        scrollElement="oelEvaluationContractor"
                        error={!!flatErrors.oelEvaluationContractor}
                        className="margin-y-0"
                      >
                        <legend className="usa-label">
                          {t('contractorTool')}
                        </legend>

                        <FieldErrorMsg>
                          {flatErrors.oelEvaluationContractor}
                        </FieldErrorMsg>

                        <ITToolsSummary
                          question={o('evaluationApproach')}
                          answers={evaluationApproaches.map(approach =>
                            translateEvaluationApproachType(approach || '')
                          )}
                          options={Object.keys(EvaluationApproachType)
                            .map(approachType =>
                              translateEvaluationApproachType(approachType)
                            )
                            .filter(
                              approachType =>
                                approachType !== EvaluationApproachType.OTHER
                            )}
                          redirect={`/models/${modelID}/task-list/ops-eval-and-learning/evaluation`}
                          answered={evaluationApproaches.length > 0}
                          needsTool={questionTwoNeedsTools}
                          subtext={t('appealsNeedsAnswer')}
                          scrollElememnt="evaluationApproaches"
                        />

                        <ITToolsFormComponent
                          flatErrors={flatErrors}
                          formikValue={values.oelEvaluationContractor}
                          fieldName="oelEvaluationContractor"
                          needsTool={questionTwoNeedsTools}
                          htmlID="oel-evaluation-contractor"
                          EnumType={OelEvaluationContractorType}
                          translation={translateOelEvaluationContractorType}
                        />
                      </FieldGroup>

                      {/* Question Three: What data do you need to monitor the model? */}

                      <FieldGroup
                        scrollElement="oelCollectData"
                        error={!!flatErrors.oelCollectData}
                        className="margin-y-0"
                      >
                        <legend className="usa-label">
                          {t('monitorTools')}
                        </legend>

                        <FieldErrorMsg>
                          {flatErrors.oelCollectData}
                        </FieldErrorMsg>

                        <ITToolsSummary
                          question={o('dataNeeded')}
                          answers={dataNeededForMonitoring.map(dataNeeded =>
                            translateDataForMonitoringType(dataNeeded || '')
                          )}
                          redirect={`/models/${modelID}/task-list/ops-eval-and-learning/evaluation`}
                          answered={dataNeededForMonitoring.length > 0}
                          needsTool={questionThreeNeedsTools}
                          subtext={t('monitorNeedsAnswer')}
                          scrollElememnt="dataNeededForMonitoring"
                        />

                        <ITToolsFormComponent
                          flatErrors={flatErrors}
                          formikValue={values.oelCollectData}
                          fieldName="oelCollectData"
                          needsTool={questionThreeNeedsTools}
                          htmlID="oel-collect-data"
                          EnumType={OelCollectDataType}
                          translation={translateOelCollectDataType}
                        />
                      </FieldGroup>

                      <div className="margin-top-6 margin-bottom-3">
                        <Button
                          type="button"
                          className="usa-button usa-button--outline margin-bottom-1"
                          onClick={() => {
                            handleFormSubmit(values, 'back');
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
                        onClick={() => handleFormSubmit(values, 'task-list')}
                      >
                        <IconArrowBack className="margin-right-1" aria-hidden />
                        {h('saveAndReturn')}
                      </Button>
                    </Fieldset>
                  </Form>
                </Grid>
              </Grid>

              {itTools.id && !loading && (
                <AutoSave
                  values={values}
                  onSave={() => {
                    handleFormSubmit(formikRef.current!.values);
                  }}
                  debounceDelay={3000}
                />
              )}
            </>
          );
        }}
      </Formik>
      <PageNumber currentPage={5} totalPages={9} className="margin-y-6" />
    </>
  );
};

export default ITToolsPageFive;
