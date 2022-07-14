import React, { Fragment, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Grid,
  IconArrowBack,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import ITToolsSummary from 'components/ITToolsSummary';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import GetITToolsPageFive from 'queries/ITTools/GetITToolsPageFive';
import {
  GetITToolPageFive as GetITToolPageFiveType,
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
  sortOtherEnum,
  translateDataForMonitoringType,
  translateEvaluationApproachType,
  translateOelCollectDataType,
  translateOelEvaluationContractorType,
  translateOelProcessAppealsType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

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
  appealPerformance: null,
  appealFeedback: null,
  appealPayments: null,
  appealOther: null,
  evaluationApproaches: [],
  dataNeededForMonitoring: []
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

  const modelPlan = data?.modelPlan;
  const modelName = modelPlan?.modelName;
  const id = modelPlan?.itTools?.id;

  const itToolsData = modelPlan?.itTools || initialFormValues;

  const {
    appealPerformance,
    appealFeedback,
    appealPayments,
    appealOther,
    evaluationApproaches,
    dataNeededForMonitoring
  } = modelPlan?.opsEvalAndLearning || initialOpsEvalAndLearningValues;

  const [update] = useMutation<UpdatePlanItToolsVariables>(UpdatePlanITTools);

  const handleFormSubmit = (
    formikValues: ITToolsPageFiveFormType,
    redirect?: 'next' | 'back' | 'task-list'
  ) => {
    const { id: updateId, __typename, ...changeValues } = formikValues;
    update({
      variables: {
        id: updateId,
        changes: changeValues
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
        initialValues={itToolsData}
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
                    <FieldGroup
                      scrollElement="oelProcessAppeals"
                      error={!!flatErrors.oelProcessAppeals}
                      className="margin-y-4"
                    >
                      <FieldArray
                        name="oelProcessAppeals"
                        render={arrayHelpers => (
                          <>
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
                                appealFeedback !== null
                                  ? o('feedbackResults')
                                  : '',
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
                              needsTool={
                                appealPerformance! ||
                                appealFeedback! ||
                                appealPayments! ||
                                appealOther!
                              }
                              subtext={t('appealsNeedsAnswer')}
                            />

                            <p className="margin-top-4">{t('tools')}</p>

                            {Object.keys(OelProcessAppealsType)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      disabled={
                                        !appealPerformance &&
                                        !appealFeedback &&
                                        !appealPayments &&
                                        !appealOther
                                      }
                                      id={`it-tools-oel-process-appeals-${type}`}
                                      name="oelProcessAppeals"
                                      label={translateOelProcessAppealsType(
                                        type
                                      )}
                                      value={type}
                                      checked={values?.oelProcessAppeals.includes(
                                        type as OelProcessAppealsType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.oelProcessAppeals.indexOf(
                                            e.target
                                              .value as OelProcessAppealsType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type === OelProcessAppealsType.OTHER &&
                                      values.oelProcessAppeals.includes(
                                        type
                                      ) && (
                                        <div className="margin-left-4 margin-top-1">
                                          <Label
                                            htmlFor="it-tools-oel-process-appeals-other"
                                            className={classNames(
                                              {
                                                'text-gray-30':
                                                  !appealPerformance &&
                                                  !appealFeedback &&
                                                  !appealPayments &&
                                                  !appealOther
                                              },
                                              'text-normal'
                                            )}
                                          >
                                            {h('pleaseSpecify')}
                                          </Label>
                                          <FieldErrorMsg>
                                            {flatErrors.oelProcessAppealsOther}
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            type="text"
                                            disabled={
                                              !appealPerformance &&
                                              !appealFeedback &&
                                              !appealPayments &&
                                              !appealOther
                                            }
                                            className="maxw-none"
                                            id="it-tools-oel-process-appeals-other"
                                            maxLength={50}
                                            name="oelProcessAppealsOther"
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                );
                              })}
                            <AddNote
                              id="it-tools-oel-process-appeals-note"
                              field="oelProcessAppealsNote"
                            />
                          </>
                        )}
                      />
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="oelEvaluationContractor"
                      error={!!flatErrors.oelEvaluationContractor}
                      className="margin-y-4"
                    >
                      <FieldArray
                        name="oelEvaluationContractor"
                        render={arrayHelpers => (
                          <>
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
                                    approachType !==
                                    EvaluationApproachType.OTHER
                                )}
                              redirect={`/models/${modelID}/task-list/ops-eval-and-learning/evaluation`}
                              answered={evaluationApproaches.length > 0}
                              needsTool={
                                evaluationApproaches.includes(
                                  EvaluationApproachType.CONTROL_INTERVENTION
                                ) ||
                                evaluationApproaches.includes(
                                  EvaluationApproachType.COMPARISON_MATCH
                                ) ||
                                evaluationApproaches.includes(
                                  EvaluationApproachType.INTERRUPTED_TIME
                                ) ||
                                evaluationApproaches.includes(
                                  EvaluationApproachType.NON_MEDICARE_DATA
                                )
                              }
                              subtext={t('appealsNeedsAnswer')}
                            />

                            <p className="margin-top-4">{t('tools')}</p>

                            {Object.keys(OelEvaluationContractorType)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      disabled={
                                        (!evaluationApproaches.includes(
                                          EvaluationApproachType.CONTROL_INTERVENTION
                                        ) &&
                                          !evaluationApproaches.includes(
                                            EvaluationApproachType.COMPARISON_MATCH
                                          ) &&
                                          !evaluationApproaches.includes(
                                            EvaluationApproachType.INTERRUPTED_TIME
                                          ) &&
                                          !evaluationApproaches.includes(
                                            EvaluationApproachType.NON_MEDICARE_DATA
                                          )) ||
                                        evaluationApproaches.length === 0
                                      }
                                      id={`it-tools-oel-evaluation-contractor-${type}`}
                                      name="oelEvaluationContractor"
                                      label={translateOelEvaluationContractorType(
                                        type
                                      )}
                                      value={type}
                                      checked={values?.oelEvaluationContractor.includes(
                                        type as OelEvaluationContractorType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.oelEvaluationContractor.indexOf(
                                            e.target
                                              .value as OelEvaluationContractorType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type ===
                                      OelEvaluationContractorType.OTHER &&
                                      values.oelEvaluationContractor.includes(
                                        type
                                      ) && (
                                        <div className="margin-left-4 margin-top-1">
                                          <Label
                                            htmlFor="it-tools-oel-evaluation-contractor-other"
                                            className={classNames(
                                              {
                                                'text-gray-30':
                                                  (!evaluationApproaches.includes(
                                                    EvaluationApproachType.CONTROL_INTERVENTION
                                                  ) &&
                                                    !evaluationApproaches.includes(
                                                      EvaluationApproachType.COMPARISON_MATCH
                                                    ) &&
                                                    !evaluationApproaches.includes(
                                                      EvaluationApproachType.INTERRUPTED_TIME
                                                    ) &&
                                                    !evaluationApproaches.includes(
                                                      EvaluationApproachType.NON_MEDICARE_DATA
                                                    )) ||
                                                  evaluationApproaches.length ===
                                                    0
                                              },
                                              'text-normal'
                                            )}
                                          >
                                            {h('pleaseSpecify')}
                                          </Label>
                                          <FieldErrorMsg>
                                            {
                                              flatErrors.oelEvaluationContractorOther
                                            }
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            type="text"
                                            disabled={
                                              (!evaluationApproaches.includes(
                                                EvaluationApproachType.CONTROL_INTERVENTION
                                              ) &&
                                                !evaluationApproaches.includes(
                                                  EvaluationApproachType.COMPARISON_MATCH
                                                ) &&
                                                !evaluationApproaches.includes(
                                                  EvaluationApproachType.INTERRUPTED_TIME
                                                ) &&
                                                !evaluationApproaches.includes(
                                                  EvaluationApproachType.NON_MEDICARE_DATA
                                                )) ||
                                              evaluationApproaches.length === 0
                                            }
                                            className="maxw-none"
                                            id="it-tools-oel-evaluation-contractor-other"
                                            maxLength={50}
                                            name="oelEvaluationContractorOther"
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                );
                              })}
                            <AddNote
                              id="it-tools-oel-evaluation-contractor-note"
                              field="oelEvaluationContractorNote"
                            />
                          </>
                        )}
                      />
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="oelCollectData"
                      error={!!flatErrors.oelCollectData}
                      className="margin-y-4"
                    >
                      <FieldArray
                        name="oelCollectData"
                        render={arrayHelpers => (
                          <>
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
                              needsTool={
                                dataNeededForMonitoring.length > 0 &&
                                !dataNeededForMonitoring.includes(
                                  DataForMonitoringType.NOT_PLANNING_TO_COLLECT_DATA
                                )
                              }
                              subtext={t('monitorNeedsAnswer')}
                            />

                            <p className="margin-top-4">{t('tools')}</p>

                            {Object.keys(OelCollectDataType)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      disabled={
                                        dataNeededForMonitoring.includes(
                                          DataForMonitoringType.NOT_PLANNING_TO_COLLECT_DATA
                                        ) ||
                                        dataNeededForMonitoring.length === 0
                                      }
                                      id={`it-tools-oel-collect-data-${type}`}
                                      name="oelCollectData"
                                      label={translateOelCollectDataType(type)}
                                      value={type}
                                      checked={values?.oelCollectData.includes(
                                        type as OelCollectDataType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.oelCollectData.indexOf(
                                            e.target.value as OelCollectDataType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type === OelCollectDataType.OTHER &&
                                      values.oelCollectData.includes(type) && (
                                        <div className="margin-left-4 margin-top-1">
                                          <Label
                                            htmlFor="it-tools-oel-collect-data-other"
                                            className={classNames(
                                              {
                                                'text-gray-30':
                                                  dataNeededForMonitoring.includes(
                                                    DataForMonitoringType.NOT_PLANNING_TO_COLLECT_DATA
                                                  ) ||
                                                  dataNeededForMonitoring.length ===
                                                    0
                                              },
                                              'text-normal'
                                            )}
                                          >
                                            {h('pleaseSpecify')}
                                          </Label>
                                          <FieldErrorMsg>
                                            {flatErrors.oelCollectDataOther}
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            type="text"
                                            disabled={
                                              dataNeededForMonitoring.includes(
                                                DataForMonitoringType.NOT_PLANNING_TO_COLLECT_DATA
                                              ) ||
                                              dataNeededForMonitoring.length ===
                                                0
                                            }
                                            className="maxw-none"
                                            id="it-tools-oel-collect-data-other"
                                            maxLength={50}
                                            name="oelCollectDataOther"
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                );
                              })}
                            <AddNote
                              id="it-tools-oel-collect-data-note"
                              field="oelCollectDataNote"
                            />
                          </>
                        )}
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
                  </Form>
                </Grid>
              </Grid>

              {id && (
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
