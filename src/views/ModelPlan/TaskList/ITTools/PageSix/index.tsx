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
import GetITToolsPageSix from 'queries/ITTools/GetITToolsPageSix';
import {
  GetITToolPageSix as GetITToolPageSixType,
  GetITToolPageSix_modelPlan_itTools as ITToolsPageSixFormType,
  GetITToolPageSix_modelPlan_opsEvalAndLearning as OpsEvalAndLearningFormType,
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
  sortOtherEnum,
  translateDataForMonitoringType,
  translateOelClaimsBasedMeasuresType,
  translateOelObtainDataType,
  translateOelQualityScoresType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

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

const initialOpsEvalAndLearningValues: OpsEvalAndLearningFormType = {
  __typename: 'PlanOpsEvalAndLearning',
  dataNeededForMonitoring: []
};

const ITToolsPageSix = () => {
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

  const modelName = data?.modelPlan?.modelName || '';

  const id = data?.modelPlan?.itTools?.id || '';

  const itToolsData = data?.modelPlan?.itTools || initialFormValues;

  const { dataNeededForMonitoring } =
    data?.modelPlan?.opsEvalAndLearning || initialOpsEvalAndLearningValues;

  const [update] = useMutation<UpdatePlanItToolsVariables>(UpdatePlanITTools);

  const handleFormSubmit = (
    formikValues: ITToolsPageSixFormType,
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
        initialValues={itToolsData}
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
                    data-testid="oit-tools-page-six-form"
                    onSubmit={e => {
                      handleSubmit(e);
                    }}
                  >
                    <FieldGroup
                      scrollElement="oelObtainData"
                      error={!!flatErrors.oelObtainData}
                      className="margin-y-4"
                    >
                      <FieldArray
                        name="oelObtainData"
                        render={arrayHelpers => (
                          <>
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
                              needsTool={
                                dataNeededForMonitoring.length > 0 &&
                                !dataNeededForMonitoring.includes(
                                  DataForMonitoringType.NOT_PLANNING_TO_COLLECT_DATA
                                )
                              }
                              subtext={t('monitorNeedsAnswer')}
                            />

                            <p className="margin-top-4">{t('tools')}</p>

                            {Object.keys(OelObtainDataType)
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
                                      id={`it-tools-oel-obtain-data-${type}`}
                                      name="oelObtainData"
                                      label={translateOelObtainDataType(type)}
                                      value={type}
                                      checked={values?.oelObtainData.includes(
                                        type as OelObtainDataType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.oelObtainData.indexOf(
                                            e.target.value as OelObtainDataType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type === OelObtainDataType.OTHER &&
                                      values.oelObtainData.includes(type) && (
                                        <div className="margin-left-4 margin-top-1">
                                          <Label
                                            htmlFor="it-tools-oel-obtain-data-other"
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
                                            {flatErrors.oelObtainDataOther}
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
                                            id="it-tools-oel-obtain-data-other"
                                            maxLength={50}
                                            name="oelObtainDataOther"
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                );
                              })}
                            <AddNote
                              id="it-tools-oel-obtain-data-note"
                              field="oelObtainDataNote"
                            />
                          </>
                        )}
                      />
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="oelClaimsBasedMeasures"
                      error={!!flatErrors.oelClaimsBasedMeasures}
                      className="margin-y-4"
                    >
                      <FieldArray
                        name="oelClaimsBasedMeasures"
                        render={arrayHelpers => (
                          <>
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
                              needsTool={dataNeededForMonitoring.includes(
                                DataForMonitoringType.QUALITY_CLAIMS_BASED_MEASURES
                              )}
                              subtext={t('claimsNeedsAnswer')}
                            />

                            <p className="margin-top-4">{t('tools')}</p>

                            {Object.keys(OelClaimsBasedMeasuresType)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      disabled={
                                        !dataNeededForMonitoring.includes(
                                          DataForMonitoringType.QUALITY_CLAIMS_BASED_MEASURES
                                        ) ||
                                        dataNeededForMonitoring.length === 0
                                      }
                                      id={`it-tools-oel-claims-based-measure-${type}`}
                                      name="oelClaimsBasedMeasures"
                                      label={translateOelClaimsBasedMeasuresType(
                                        type
                                      )}
                                      value={type}
                                      checked={values?.oelClaimsBasedMeasures.includes(
                                        type as OelClaimsBasedMeasuresType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.oelClaimsBasedMeasures.indexOf(
                                            e.target
                                              .value as OelClaimsBasedMeasuresType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type ===
                                      OelClaimsBasedMeasuresType.OTHER &&
                                      values.oelClaimsBasedMeasures.includes(
                                        type
                                      ) && (
                                        <div className="margin-left-4 margin-top-1">
                                          <Label
                                            htmlFor="it-tools-oel-claims-based-measure-other"
                                            className={classNames(
                                              {
                                                'text-gray-30':
                                                  !dataNeededForMonitoring.includes(
                                                    DataForMonitoringType.QUALITY_CLAIMS_BASED_MEASURES
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
                                            {
                                              flatErrors.oelClaimsBasedMeasuresOther
                                            }
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            type="text"
                                            disabled={
                                              !dataNeededForMonitoring.includes(
                                                DataForMonitoringType.QUALITY_CLAIMS_BASED_MEASURES
                                              ) ||
                                              dataNeededForMonitoring.length ===
                                                0
                                            }
                                            className="maxw-none"
                                            id="it-tools-oel-claims-based-measure-other"
                                            maxLength={50}
                                            name="oelClaimsBasedMeasuresOther"
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                );
                              })}
                            <AddNote
                              id="it-tools-oel-claims-based-measure-note"
                              field="oelClaimsBasedMeasuresNote"
                            />
                          </>
                        )}
                      />
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="oelQualityScores"
                      error={!!flatErrors.oelQualityScores}
                      className="margin-y-4"
                    >
                      <FieldArray
                        name="oelQualityScores"
                        render={arrayHelpers => (
                          <>
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
                              needsTool={dataNeededForMonitoring.includes(
                                DataForMonitoringType.QUALITY_REPORTED_MEASURES
                              )}
                              subtext={t('qualityNeedsAnswer')}
                            />

                            <p className="margin-top-4">{t('tools')}</p>

                            {Object.keys(OelQualityScoresType)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      disabled={
                                        !dataNeededForMonitoring.includes(
                                          DataForMonitoringType.QUALITY_REPORTED_MEASURES
                                        ) ||
                                        dataNeededForMonitoring.length === 0
                                      }
                                      id={`it-tools-oel-quality-scores-${type}`}
                                      name="oelQualityScores"
                                      label={translateOelQualityScoresType(
                                        type
                                      )}
                                      value={type}
                                      checked={values?.oelQualityScores.includes(
                                        type as OelQualityScoresType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.oelQualityScores.indexOf(
                                            e.target
                                              .value as OelQualityScoresType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type === OelQualityScoresType.OTHER &&
                                      values.oelQualityScores.includes(
                                        type
                                      ) && (
                                        <div className="margin-left-4 margin-top-1">
                                          <Label
                                            htmlFor="it-tools-oel-quality-scores-other"
                                            className={classNames(
                                              {
                                                'text-gray-30':
                                                  !dataNeededForMonitoring.includes(
                                                    DataForMonitoringType.QUALITY_REPORTED_MEASURES
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
                                            {flatErrors.oelQualityScoresOther}
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            type="text"
                                            disabled={
                                              !dataNeededForMonitoring.includes(
                                                DataForMonitoringType.QUALITY_REPORTED_MEASURES
                                              ) ||
                                              dataNeededForMonitoring.length ===
                                                0
                                            }
                                            className="maxw-none"
                                            id="it-tools-oel-quality-scores-other"
                                            maxLength={50}
                                            name="oelQualityScoresOther"
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                );
                              })}
                            <AddNote
                              id="it-tools-oel-quality-scores-note"
                              field="oelQualityScoresNote"
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
      <PageNumber currentPage={6} totalPages={9} className="margin-y-6" />
    </>
  );
};

export default ITToolsPageSix;
