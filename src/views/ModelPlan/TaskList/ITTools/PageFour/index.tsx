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
import GetITToolsPageFour from 'queries/ITTools/GetITToolsPageFour';
import {
  GetITToolPageFour as GetITToolPageFourType,
  GetITToolPageFour_modelPlan as ModelPlanType,
  GetITToolPageFour_modelPlan_itTools as ITToolsPageFourFormType,
  GetITToolPageFour_modelPlan_opsEvalAndLearning as OpsEvalAndLearningType,
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
  translateBenchmarkForPerformanceType,
  translateBoolean,
  translateOelHelpdeskSupportType,
  translateOelManageAcoSubinfoType,
  translateOelManageAcoType,
  translateOelPerformanceBenchmarkType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import { ITToolsFormComponent } from '..';

const initialFormValues: ITToolsPageFourFormType = {
  __typename: 'PlanITTools',
  id: '',
  oelHelpdeskSupport: [],
  oelHelpdeskSupportOther: '',
  oelHelpdeskSupportNote: '',
  oelManageAco: [],
  oelManageAcoOther: '',
  oelManageAcoNote: '',
  oelPerformanceBenchmark: [],
  oelPerformanceBenchmarkOther: '',
  oelPerformanceBenchmarkNote: ''
};

const initialOpsEvalAndLearningValues: OpsEvalAndLearningType = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '',
  helpdeskUse: null,
  iddocSupport: null,
  benchmarkForPerformance: null
};

const initialModelPlanValues: ModelPlanType = {
  __typename: 'ModelPlan',
  id: '',
  modelName: '',
  opsEvalAndLearning: initialOpsEvalAndLearningValues,
  itTools: initialFormValues
};

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

  const modelPlan = data?.modelPlan || initialModelPlanValues;

  const {
    modelName,
    itTools,
    opsEvalAndLearning: { helpdeskUse, iddocSupport, benchmarkForPerformance }
  } = modelPlan;

  /**
   * Identifying if each question requires tooling as well as rending answers
   * Checkbox answers will not be checked despite a store truthy boolean
   * 'Specify other' answer will not be rendered even if OTHER value is true
   */
  const questionOneNeedsTools: boolean = helpdeskUse || false;

  const questionTwoNeedsTools: boolean = iddocSupport || false;

  const questionThreeNeedsTools: boolean =
    benchmarkForPerformance === BenchmarkForPerformanceType.YES_RECONCILE ||
    benchmarkForPerformance === BenchmarkForPerformanceType.YES_NO_RECONCILE;

  const [update] = useMutation<UpdatePlanItToolsVariables>(UpdatePlanITTools);

  const handleFormSubmit = (
    formikValues: ITToolsPageFourFormType,
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

                    <Fieldset disabled={loading}>
                      {/* Question One: Do you plan to use a helpdesk? */}
                      <FieldGroup
                        scrollElement="oelHelpdeskSupport"
                        error={!!flatErrors.oelHelpdeskSupport}
                        className="margin-y-4"
                      >
                        <legend className="usa-label maxw-none">
                          {t('helpDeskTools')}
                        </legend>

                        <FieldErrorMsg>
                          {flatErrors.oelHelpdeskSupport}
                        </FieldErrorMsg>

                        <ITToolsSummary
                          question={o('helpDesk')}
                          answers={[translateBoolean(helpdeskUse || false)]}
                          redirect={`/models/${modelID}/task-list/ops-eval-and-learning`}
                          answered={helpdeskUse !== null}
                          needsTool={questionOneNeedsTools}
                          subtext={t('yesNeedsAnswer')}
                          scrollElememnt="helpdeskUse"
                        />

                        <ITToolsFormComponent
                          flatErrors={flatErrors}
                          formikValue={values.oelHelpdeskSupport}
                          fieldName="oelHelpdeskSupport"
                          needsTool={questionOneNeedsTools}
                          htmlID="oel-help-desk"
                          EnumType={OelHelpdeskSupportType}
                          translation={translateOelHelpdeskSupportType}
                        />
                      </FieldGroup>

                      {/* Question Two: Are you planning to use IDDOC support? */}

                      <FieldGroup
                        scrollElement="oelManageAco"
                        error={!!flatErrors.oelManageAco}
                        className="margin-y-4"
                      >
                        <legend className="usa-label maxw-none">
                          {t('iddocTools')}
                        </legend>

                        <FieldErrorMsg>{flatErrors.oelManageAco}</FieldErrorMsg>

                        <ITToolsSummary
                          question={o('iddocSupport')}
                          answers={[translateBoolean(iddocSupport || false)]}
                          redirect={`/models/${modelID}/task-list/ops-eval-and-learning`}
                          answered={iddocSupport !== null}
                          needsTool={questionTwoNeedsTools}
                          subtext={t('yesNeedsAnswer')}
                          scrollElememnt="iddocSupport"
                        />

                        <ITToolsFormComponent
                          flatErrors={flatErrors}
                          formikValue={values.oelManageAco}
                          fieldName="oelManageAco"
                          needsTool={questionTwoNeedsTools}
                          htmlID="oel-manage-aco"
                          EnumType={OelManageAcoType}
                          translation={translateOelManageAcoType}
                          subTranslation={translateOelManageAcoSubinfoType}
                        />
                      </FieldGroup>

                      {/* Question Three: Will you establish a benchmark to capture performance? */}

                      <FieldGroup
                        scrollElement="oelPerformanceBenchmark"
                        error={!!flatErrors.oelPerformanceBenchmark}
                        className="margin-y-4"
                      >
                        <legend className="usa-label maxw-none">
                          {t('benchmarkTools')}
                        </legend>

                        <FieldErrorMsg>
                          {flatErrors.oelPerformanceBenchmark}
                        </FieldErrorMsg>

                        <ITToolsSummary
                          question={o('establishBenchmark')}
                          answers={[benchmarkForPerformance].map(benchmark =>
                            translateBenchmarkForPerformanceType(
                              benchmark || ''
                            )
                          )}
                          redirect={`/models/${modelID}/task-list/ops-eval-and-learning/performance`}
                          answered={benchmarkForPerformance !== null}
                          needsTool={questionThreeNeedsTools}
                          subtext={t('eitherYesNeedsAnswer')}
                          scrollElememnt="benchmarkForPerformance"
                        />

                        <ITToolsFormComponent
                          flatErrors={flatErrors}
                          formikValue={values.oelPerformanceBenchmark}
                          fieldName="oelPerformanceBenchmark"
                          needsTool={questionThreeNeedsTools}
                          htmlID="oel-performance-benchmark"
                          EnumType={OelPerformanceBenchmarkType}
                          translation={translateOelPerformanceBenchmarkType}
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
      <PageNumber currentPage={4} totalPages={9} className="margin-y-6" />
    </>
  );
};

export default ITToolsPageFour;
