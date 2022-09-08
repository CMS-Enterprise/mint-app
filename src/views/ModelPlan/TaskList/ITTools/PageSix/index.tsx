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
import GetITToolsPageSix from 'queries/ITTools/GetITToolsPageSix';
import {
  GetITToolPageSix as GetITToolPageSixType,
  GetITToolPageSix_modelPlan as ModelPlanType,
  GetITToolPageSix_modelPlan_itTools as ITToolsPageSixFormType,
  GetITToolPageSix_modelPlan_opsEvalAndLearning as OpsEvalAndLearningType,
  GetITToolPageSixVariables
} from 'queries/ITTools/types/GetITToolPageSix';
import { UpdatePlanItToolsVariables } from 'queries/ITTools/types/UpdatePlanItTools';
import UpdatePlanITTools from 'queries/ITTools/UpdatePlanItTools';
import {
  DataForMonitoringType,
  OelClaimsBasedMeasuresType,
  OelObtainDataType,
  OelQualityScoresType
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import {
  translateDataForMonitoringType,
  translateOelClaimsBasedMeasuresType,
  translateOelObtainDataType,
  translateOelQualityScoresType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';
import { LockStatus } from 'views/SubscriptionHandler';

import { ITToolsFormComponent } from '..';

const initialFormValues: ITToolsPageSixFormType = {
  __typename: 'PlanITTools',
  id: '',
  oelObtainData: [],
  oelObtainDataOther: '',
  oelObtainDataNote: '',
  oelClaimsBasedMeasures: [],
  oelClaimsBasedMeasuresOther: '',
  oelClaimsBasedMeasuresNote: '',
  oelQualityScores: [],
  oelQualityScoresOther: '',
  oelQualityScoresNote: ''
};

const initialOpsEvalAndLearningValues: OpsEvalAndLearningType = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '',
  dataNeededForMonitoring: []
};

const initialModelPlanValues: ModelPlanType = {
  __typename: 'ModelPlan',
  id: '',
  modelName: '',
  opsEvalAndLearning: initialOpsEvalAndLearningValues,
  itTools: initialFormValues
};

const ITToolsPageSix = ({
  opsEvalAndLearningLock
}: {
  opsEvalAndLearningLock: LockStatus;
}) => {
  const { t } = useTranslation('itTools');
  const { t: o } = useTranslation('operationsEvaluationAndLearning');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();
  const formikRef = useRef<FormikProps<ITToolsPageSixFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetITToolPageSixType,
    GetITToolPageSixVariables
  >(GetITToolsPageSix, {
    variables: {
      id: modelID
    }
  });

  const modelPlan = data?.modelPlan || initialModelPlanValues;

  const {
    modelName,
    itTools,
    opsEvalAndLearning: { dataNeededForMonitoring }
  } = modelPlan;

  /**
   * Identifying if each question requires tooling as well as rending answers
   * Checkbox answers will not be checked despite a store truthy boolean
   * 'Specify other' answer will not be rendered even if OTHER value is true
   */
  const questionOneNeedsTools: boolean =
    dataNeededForMonitoring.length > 0 &&
    !dataNeededForMonitoring.includes(
      DataForMonitoringType.NOT_PLANNING_TO_COLLECT_DATA
    );

  const questionTwoNeedsTools: boolean = dataNeededForMonitoring.includes(
    DataForMonitoringType.QUALITY_CLAIMS_BASED_MEASURES
  );

  const questionThreeNeedsTools: boolean = dataNeededForMonitoring.includes(
    DataForMonitoringType.QUALITY_REPORTED_MEASURES
  );

  const [update] = useMutation<UpdatePlanItToolsVariables>(UpdatePlanITTools);

  const handleFormSubmit = (
    formikValues: ITToolsPageSixFormType,
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
            history.push(`/models/${modelID}/task-list/it-tools/page-seven`);
          } else if (redirect === 'back') {
            history.push(`/models/${modelID}/task-list/it-tools/page-five`);
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
        {(formikProps: FormikProps<ITToolsPageSixFormType>) => {
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
                    data-testid="it-tools-page-six-form"
                    onSubmit={e => {
                      handleSubmit(e);
                    }}
                  >
                    <Fieldset disabled={loading}>
                      {/* Question One: What data do you need to monitor the model? */}
                      <FieldGroup
                        scrollElement="oelObtainData"
                        error={!!flatErrors.oelObtainData}
                        className="margin-y-0"
                      >
                        <legend className="usa-label">
                          {t('supportTools')}
                        </legend>

                        <FieldErrorMsg>
                          {flatErrors.oelObtainData}
                        </FieldErrorMsg>

                        <ITToolsSummary
                          question={o('dataNeeded')}
                          answers={dataNeededForMonitoring.map(dataNeeded =>
                            translateDataForMonitoringType(dataNeeded || '')
                          )}
                          options={Object.keys(DataForMonitoringType)
                            .map(dataType =>
                              translateDataForMonitoringType(dataType)
                            )
                            .filter(
                              dataType =>
                                dataType !==
                                DataForMonitoringType.NOT_PLANNING_TO_COLLECT_DATA
                            )}
                          redirect={`/models/${modelID}/task-list/ops-eval-and-learning/evaluation`}
                          answered={dataNeededForMonitoring.length > 0}
                          needsTool={questionOneNeedsTools}
                          subtext={t('monitorNeedsAnswer')}
                          locked={opsEvalAndLearningLock}
                          scrollElememnt="dataNeededForMonitoring"
                        />

                        <ITToolsFormComponent
                          flatErrors={flatErrors}
                          formikValue={values.oelObtainData}
                          fieldName="oelObtainData"
                          needsTool={questionOneNeedsTools}
                          htmlID="oel-obtain-data"
                          EnumType={OelObtainDataType}
                          translation={translateOelObtainDataType}
                        />
                      </FieldGroup>

                      {/* Question Two: What data do you need to monitor the model? */}

                      <FieldGroup
                        scrollElement="oelClaimsBasedMeasures"
                        error={!!flatErrors.oelClaimsBasedMeasures}
                        className="margin-y-0"
                      >
                        <legend className="usa-label">
                          {t('claimsBasedTools')}
                        </legend>

                        <FieldErrorMsg>
                          {flatErrors.oelClaimsBasedMeasures}
                        </FieldErrorMsg>

                        <ITToolsSummary
                          question={o('dataNeeded')}
                          answers={dataNeededForMonitoring.map(dataNeeded =>
                            translateDataForMonitoringType(dataNeeded || '')
                          )}
                          redirect={`/models/${modelID}/task-list/ops-eval-and-learning/evaluation`}
                          answered={dataNeededForMonitoring.length > 0}
                          needsTool={questionTwoNeedsTools}
                          subtext={t('claimsNeedsAnswer')}
                          locked={opsEvalAndLearningLock}
                          scrollElememnt="dataNeededForMonitoring"
                        />

                        <ITToolsFormComponent
                          flatErrors={flatErrors}
                          formikValue={values.oelClaimsBasedMeasures}
                          fieldName="oelClaimsBasedMeasures"
                          needsTool={questionTwoNeedsTools}
                          htmlID="oel-claims-based-measure"
                          EnumType={OelClaimsBasedMeasuresType}
                          translation={translateOelClaimsBasedMeasuresType}
                        />
                      </FieldGroup>

                      {/* Question Three: What data do you need to monitor the model? */}

                      <FieldGroup
                        scrollElement="oelQualityScores"
                        error={!!flatErrors.oelQualityScores}
                        className="margin-y-0"
                      >
                        <legend className="usa-label maxw-none">
                          {t('qualityTools')}
                        </legend>

                        <FieldErrorMsg>
                          {flatErrors.oelQualityScores}
                        </FieldErrorMsg>

                        <ITToolsSummary
                          question={o('dataNeeded')}
                          answers={dataNeededForMonitoring.map(dataNeeded =>
                            translateDataForMonitoringType(dataNeeded || '')
                          )}
                          redirect={`/models/${modelID}/task-list/ops-eval-and-learning/evaluation`}
                          answered={dataNeededForMonitoring.length > 0}
                          needsTool={questionThreeNeedsTools}
                          subtext={t('qualityNeedsAnswer')}
                          locked={opsEvalAndLearningLock}
                          scrollElememnt="dataNeededForMonitoring"
                        />

                        <ITToolsFormComponent
                          flatErrors={flatErrors}
                          formikValue={values.oelQualityScores}
                          fieldName="oelQualityScores"
                          needsTool={questionThreeNeedsTools}
                          htmlID="oel-quality-scores"
                          EnumType={OelQualityScoresType}
                          translation={translateOelQualityScoresType}
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
      <PageNumber currentPage={6} totalPages={9} className="margin-y-6" />
    </>
  );
};

export default ITToolsPageSix;
