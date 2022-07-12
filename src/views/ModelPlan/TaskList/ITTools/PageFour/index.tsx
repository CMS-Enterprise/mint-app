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
import GetITToolsPageFour from 'queries/ITTools/GetITToolsPageFour';
import {
  GetITToolPageFour as GetITToolPageFourType,
  GetITToolPageFour_modelPlan_itTools as ITToolsPageFourFormType,
  GetITToolPageFour_modelPlan_opsEvalAndLearning as OpsEvalAndLearnignFormType,
  GetITToolPageFourVariables
} from 'queries/ITTools/types/GetITToolPageFour';
import { UpdatePlanItToolsVariables } from 'queries/ITTools/types/UpdatePlanItTools';
import UpdatePlanITTools from 'queries/ITTools/UpdatePlanItTools';
import {
  BenchmarkForPerformanceType,
  OelHelpdeskSupportType,
  OelManageAcoType,
  OelPerformanceBenchmarkType
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import {
  sortOtherEnum,
  translateBenchmarkForPerformanceType,
  translateBoolean,
  translateOelHelpdeskSupportType,
  translateOelManageAcoSubinfoType,
  translateOelManageAcoType,
  translateOelPerformanceBenchmarkType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

const ITToolsPageFour = () => {
  const { t } = useTranslation('itTools');
  const { t: o } = useTranslation('operationsEvaluationAndLearning');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<ITToolsPageFourFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetITToolPageFourType,
    GetITToolPageFourVariables
  >(GetITToolsPageFour, {
    variables: {
      id: modelID
    }
  });

  const {
    id,
    oelHelpdeskSupport,
    oelHelpdeskSupportOther,
    oelHelpdeskSupportNote,
    oelManageAco,
    oelManageAcoOther,
    oelManageAcoNote,
    oelPerformanceBenchmark,
    oelPerformanceBenchmarkOther,
    oelPerformanceBenchmarkNote
  } = data?.modelPlan?.itTools || ({} as ITToolsPageFourFormType);

  const { helpdeskUse, iddocSupport, benchmarkForPerformance } =
    data?.modelPlan?.opsEvalAndLearning || ({} as OpsEvalAndLearnignFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const [update] = useMutation<UpdatePlanItToolsVariables>(UpdatePlanITTools);

  const handleFormSubmit = (
    formikValues: ITToolsPageFourFormType,
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
            history.push(`/models/${modelID}/task-list/it-tools/page-five`);
          } else if (redirect === 'back') {
            history.push(`/models/${modelID}/task-list/it-tools/page-three`);
          } else if (redirect === 'task-list') {
            history.push(`/models/${modelID}/task-list`);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const initialValues: ITToolsPageFourFormType = {
    __typename: 'PlanITTools',
    id: id ?? '',
    oelHelpdeskSupport: oelHelpdeskSupport ?? [],
    oelHelpdeskSupportOther: oelHelpdeskSupportOther ?? '',
    oelHelpdeskSupportNote: oelHelpdeskSupportNote ?? '',
    oelManageAco: oelManageAco ?? [],
    oelManageAcoOther: oelManageAcoOther ?? '',
    oelManageAcoNote: oelManageAcoNote ?? '',
    oelPerformanceBenchmark: oelPerformanceBenchmark ?? [],
    oelPerformanceBenchmarkOther: oelPerformanceBenchmarkOther ?? '',
    oelPerformanceBenchmarkNote: oelPerformanceBenchmarkNote ?? ''
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
        <Trans i18nKey="modelPlanTaskList:subheading">
          indexZero {modelName} indexTwo
        </Trans>
      </p>
      <p className="margin-bottom-2 font-body-md line-height-sans-4">
        {t('subheading')}
      </p>

      <AskAQuestion modelID={modelID} />

      <Formik
        initialValues={initialValues}
        onSubmit={values => {
          handleFormSubmit(values, 'next');
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<ITToolsPageFourFormType>) => {
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
                    data-testid="oit-tools-page-four-form"
                    onSubmit={e => {
                      handleSubmit(e);
                    }}
                  >
                    <h2>{o('heading')}</h2>

                    <FieldGroup
                      scrollElement="oelHelpdeskSupport"
                      error={!!flatErrors.oelHelpdeskSupport}
                      className="margin-y-4"
                    >
                      <FieldArray
                        name="oelHelpdeskSupport"
                        render={arrayHelpers => (
                          <>
                            <legend className="usa-label maxw-none">
                              {t('helpDeskTools')}
                            </legend>

                            <FieldErrorMsg>
                              {flatErrors.oelHelpdeskSupport}
                            </FieldErrorMsg>

                            <ITToolsSummary
                              question={o('helpDesk')}
                              answers={[translateBoolean(helpdeskUse || false)]}
                              options={[translateBoolean(true)]}
                              redirect={`/models/${modelID}/task-list/ops-eval-and-learning`}
                              answered={helpdeskUse !== null}
                              needsTool={helpdeskUse || false}
                            />

                            <p className="margin-top-4">{t('tools')}</p>

                            {Object.keys(OelHelpdeskSupportType)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      disabled={!helpdeskUse}
                                      id={`it-tools-oel-help-desk-${type}`}
                                      name="oelHelpdeskSupport"
                                      label={translateOelHelpdeskSupportType(
                                        type
                                      )}
                                      value={type}
                                      checked={values?.oelHelpdeskSupport.includes(
                                        type as OelHelpdeskSupportType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.oelHelpdeskSupport.indexOf(
                                            e.target
                                              .value as OelHelpdeskSupportType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type === OelHelpdeskSupportType.OTHER &&
                                      values.oelHelpdeskSupport.includes(
                                        type
                                      ) && (
                                        <div className="margin-left-4 margin-top-1">
                                          <Label
                                            htmlFor="it-tools-oel-help-desk-other"
                                            className="text-normal"
                                          >
                                            {h('pleaseSpecify')}
                                          </Label>
                                          <FieldErrorMsg>
                                            {flatErrors.oelHelpdeskSupportOther}
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            disabled={!helpdeskUse}
                                            className="maxw-none"
                                            id="it-tools-oel-help-desk-other"
                                            maxLength={50}
                                            name="oelHelpdeskSupportOther"
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                );
                              })}
                            <AddNote
                              id="it-tools-oel-help-desk-note"
                              field="oelHelpdeskSupportNote"
                            />
                          </>
                        )}
                      />
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="oelManageAco"
                      error={!!flatErrors.oelManageAco}
                      className="margin-y-4"
                    >
                      <FieldArray
                        name="oelManageAco"
                        render={arrayHelpers => (
                          <>
                            <legend className="usa-label maxw-none">
                              {t('iddocTools')}
                            </legend>

                            <FieldErrorMsg>
                              {flatErrors.oelManageAco}
                            </FieldErrorMsg>

                            <ITToolsSummary
                              question={o('iddocSupport')}
                              answers={[
                                translateBoolean(iddocSupport || false)
                              ]}
                              options={[translateBoolean(true)]}
                              redirect={`/models/${modelID}/task-list/ops-eval-and-learning`}
                              answered={iddocSupport !== null}
                              needsTool={iddocSupport || false}
                            />

                            <p className="margin-top-4">{t('tools')}</p>

                            {Object.keys(OelManageAcoType)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      disabled={!iddocSupport}
                                      id={`it-tools-oel-manage-aco-${type}`}
                                      name="oelManageAco"
                                      label={translateOelManageAcoType(type)}
                                      subLabel={translateOelManageAcoSubinfoType(
                                        type
                                      )}
                                      value={type}
                                      checked={values?.oelManageAco.includes(
                                        type as OelManageAcoType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.oelManageAco.indexOf(
                                            e.target.value as OelManageAcoType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type === OelManageAcoType.OTHER &&
                                      values.oelManageAco.includes(type) && (
                                        <div className="margin-left-4 margin-top-1">
                                          <Label
                                            htmlFor="it-tools-oel-manage-aco-other"
                                            className="text-normal"
                                          >
                                            {h('pleaseSpecify')}
                                          </Label>
                                          <FieldErrorMsg>
                                            {flatErrors.oelManageAcoOther}
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            disabled={!iddocSupport}
                                            className="maxw-none"
                                            id="it-tools-oel-manage-aco-other"
                                            maxLength={50}
                                            name="oelManageAcoOther"
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                );
                              })}
                            <AddNote
                              id="it-tools-oel-manage-aco-note"
                              field="oelManageAcoNote"
                            />
                          </>
                        )}
                      />
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="oelPerformanceBenchmark"
                      error={!!flatErrors.oelPerformanceBenchmark}
                      className="margin-y-4"
                    >
                      <FieldArray
                        name="oelPerformanceBenchmark"
                        render={arrayHelpers => (
                          <>
                            <legend className="usa-label maxw-none">
                              {t('benchmarkTools')}
                            </legend>

                            <FieldErrorMsg>
                              {flatErrors.oelPerformanceBenchmark}
                            </FieldErrorMsg>

                            <ITToolsSummary
                              question={o('establishBenchmark')}
                              answers={[
                                benchmarkForPerformance
                              ].map(benchmark =>
                                translateBenchmarkForPerformanceType(
                                  benchmark || ''
                                )
                              )}
                              options={[
                                translateBenchmarkForPerformanceType(
                                  BenchmarkForPerformanceType.YES_RECONCILE
                                ),
                                translateBenchmarkForPerformanceType(
                                  BenchmarkForPerformanceType.YES_NO_RECONCILE
                                )
                              ]}
                              redirect={`/models/${modelID}/task-list/ops-eval-and-learning/performance`}
                              answered={benchmarkForPerformance !== null}
                              needsTool={
                                benchmarkForPerformance ===
                                  BenchmarkForPerformanceType.YES_RECONCILE ||
                                benchmarkForPerformance ===
                                  BenchmarkForPerformanceType.YES_NO_RECONCILE
                              }
                            />

                            <p className="margin-top-4">{t('tools')}</p>

                            {Object.keys(OelPerformanceBenchmarkType)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      disabled={
                                        benchmarkForPerformance ===
                                          BenchmarkForPerformanceType.NO ||
                                        benchmarkForPerformance === null
                                      }
                                      id={`it-tools-oel-performance-benchmark-${type}`}
                                      name="oelPerformanceBenchmark"
                                      label={translateOelPerformanceBenchmarkType(
                                        type
                                      )}
                                      value={type}
                                      checked={values?.oelPerformanceBenchmark.includes(
                                        type as OelPerformanceBenchmarkType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.oelPerformanceBenchmark.indexOf(
                                            e.target
                                              .value as OelPerformanceBenchmarkType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type ===
                                      OelPerformanceBenchmarkType.OTHER &&
                                      values.oelPerformanceBenchmark.includes(
                                        type
                                      ) && (
                                        <div className="margin-left-4 margin-top-1">
                                          <Label
                                            htmlFor="it-tools-oel-performance-benchmark-other"
                                            className="text-normal"
                                          >
                                            {h('pleaseSpecify')}
                                          </Label>
                                          <FieldErrorMsg>
                                            {
                                              flatErrors.oelPerformanceBenchmarkOther
                                            }
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            disabled={
                                              benchmarkForPerformance ===
                                                BenchmarkForPerformanceType.NO ||
                                              benchmarkForPerformance === null
                                            }
                                            className="maxw-none"
                                            id="it-tools-oel-performance-benchmark-other"
                                            maxLength={50}
                                            name="oelPerformanceBenchmarkOther"
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                );
                              })}
                            <AddNote
                              id="it-tools-oel-performance-benchmark-note"
                              field="oelPerformanceBenchmarkNote"
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
      <PageNumber currentPage={4} totalPages={9} className="margin-y-6" />
    </>
  );
};

export default ITToolsPageFour;
