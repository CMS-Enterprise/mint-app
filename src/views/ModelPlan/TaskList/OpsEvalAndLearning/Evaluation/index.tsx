import React, { Fragment, useRef } from 'react';
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
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import ITSolutionsWarning from 'components/ITSolutionsWarning';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import TextAreaField from 'components/shared/TextAreaField';
import useScrollElement from 'hooks/useScrollElement';
import GetEvaluation from 'queries/OpsEvalAndLearning/GetEvaluation';
import {
  GetEvaluation as GetEvaluationType,
  GetEvaluation_modelPlan_opsEvalAndLearning as EvaluationFormType,
  GetEvaluationVariables
} from 'queries/OpsEvalAndLearning/types/GetEvaluation';
import { UpdatePlanOpsEvalAndLearningVariables } from 'queries/OpsEvalAndLearning/types/UpdatePlanOpsEvalAndLearning';
import UpdatePlanOpsEvalAndLearning from 'queries/OpsEvalAndLearning/UpdatePlanOpsEvalAndLearning';
import {
  CcmInvolvmentType,
  DataForMonitoringType,
  DataToSendParticipantsType,
  EvaluationApproachType
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import {
  mapMultiSelectOptions,
  sortOtherEnum,
  translateCcmInvolvmentType,
  translateDataForMonitoringType,
  translateDataToSendParticipantsType,
  translateEvaluationApproachType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import {
  isCCWInvolvement,
  isQualityMeasures,
  renderCurrentPage,
  renderTotalPages
} from '..';

const Evaluation = () => {
  const { t } = useTranslation('operationsEvaluationAndLearning');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<EvaluationFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetEvaluationType,
    GetEvaluationVariables
  >(GetEvaluation, {
    variables: {
      id: modelID
    }
  });

  const {
    id,
    iddocSupport,
    evaluationApproaches,
    evaluationApproachOther,
    evalutaionApproachNote,
    ccmInvolvment,
    ccmInvolvmentOther,
    ccmInvolvmentNote,
    dataNeededForMonitoring,
    dataNeededForMonitoringOther,
    dataNeededForMonitoringNote,
    dataToSendParticicipants,
    dataToSendParticicipantsOther,
    dataToSendParticicipantsNote,
    shareCclfData,
    shareCclfDataNote
  } = data?.modelPlan?.opsEvalAndLearning || ({} as EvaluationFormType);

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
            if (
              isCCWInvolvement(formikRef?.current?.values.ccmInvolvment) ||
              isQualityMeasures(
                formikRef?.current?.values.dataNeededForMonitoring
              )
            ) {
              history.push(
                `/models/${modelID}/task-list/ops-eval-and-learning/ccw-and-quality`
              );
            } else {
              history.push(
                `/models/${modelID}/task-list/ops-eval-and-learning/data-sharing`
              );
            }
          } else if (redirect === 'back') {
            history.push(
              `/models/${modelID}/task-list/ops-eval-and-learning/performance`
            );
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

  const initialValues: EvaluationFormType = {
    __typename: 'PlanOpsEvalAndLearning',
    id: id ?? '',
    iddocSupport: iddocSupport ?? null,
    evaluationApproaches: evaluationApproaches ?? [],
    evaluationApproachOther: evaluationApproachOther ?? '',
    evalutaionApproachNote: evalutaionApproachNote ?? '',
    ccmInvolvment: ccmInvolvment ?? [],
    ccmInvolvmentOther: ccmInvolvmentOther ?? '',
    ccmInvolvmentNote: ccmInvolvmentNote ?? '',
    dataNeededForMonitoring: dataNeededForMonitoring ?? [],
    dataNeededForMonitoringOther: dataNeededForMonitoringOther ?? '',
    dataNeededForMonitoringNote: dataNeededForMonitoringNote ?? '',
    dataToSendParticicipants: dataToSendParticicipants ?? [],
    dataToSendParticicipantsOther: dataToSendParticicipantsOther ?? '',
    dataToSendParticicipantsNote: dataToSendParticicipantsNote ?? '',
    shareCclfData: shareCclfData ?? null,
    shareCclfDataNote: shareCclfDataNote ?? ''
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
        {(formikProps: FormikProps<EvaluationFormType>) => {
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
                data-testid="ops-eval-and-learning-evaluation-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <FieldGroup
                  scrollElement="evaluationApproaches"
                  error={!!flatErrors.evaluationApproaches}
                >
                  <FieldArray
                    name="evaluationApproaches"
                    render={arrayHelpers => (
                      <>
                        <legend className="usa-label">
                          {t('evaluationApproach')}
                        </legend>

                        {itSolutionsStarted && (
                          <ITSolutionsWarning
                            id="ops-eval-and-learning-evaluation-approach-warning"
                            onClick={() =>
                              handleFormSubmit(
                                `/models/${modelID}/task-list/it-solutions`
                              )
                            }
                          />
                        )}

                        <FieldErrorMsg>
                          {flatErrors.evaluationApproaches}
                        </FieldErrorMsg>

                        {Object.keys(EvaluationApproachType)
                          .sort(sortOtherEnum)
                          .map(type => {
                            return (
                              <Fragment key={type}>
                                <Field
                                  as={CheckboxField}
                                  id={`ops-eval-and-learning-evaluation-approach-${type}`}
                                  data-testid={`ops-eval-and-learning-evaluation-approach-${type}`}
                                  name="evaluationApproaches"
                                  label={translateEvaluationApproachType(type)}
                                  value={type}
                                  checked={values?.evaluationApproaches.includes(
                                    type as EvaluationApproachType
                                  )}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    if (e.target.checked) {
                                      arrayHelpers.push(e.target.value);
                                    } else {
                                      const idx = values.evaluationApproaches.indexOf(
                                        e.target.value as EvaluationApproachType
                                      );
                                      arrayHelpers.remove(idx);
                                    }
                                  }}
                                />
                                {type === EvaluationApproachType.OTHER &&
                                  values.evaluationApproaches.includes(
                                    type
                                  ) && (
                                    <div className="margin-left-4 margin-top-neg-2">
                                      <Label
                                        htmlFor="ops-eval-and-learning-evaluation-approach-other"
                                        className="text-normal maxw-none"
                                      >
                                        {t('evaluationOther')}
                                      </Label>
                                      <FieldErrorMsg>
                                        {flatErrors.evaluationApproachOther}
                                      </FieldErrorMsg>
                                      <Field
                                        as={TextInput}
                                        className="maxw-none"
                                        id="ops-eval-and-learning-evaluation-approach-other"
                                        maxLength={50}
                                        name="evaluationApproachOther"
                                      />
                                    </div>
                                  )}
                              </Fragment>
                            );
                          })}
                        <AddNote
                          id="ops-eval-and-learning-evaluation-approach-note"
                          field="evalutaionApproachNote"
                        />
                      </>
                    )}
                  />
                </FieldGroup>

                <FieldArray
                  name="ccmInvolvment"
                  render={arrayHelpers => (
                    <>
                      <legend className="usa-label">{t('ccw')}</legend>

                      <p className="text-base margin-y-1">{t('ccwInfo')}</p>

                      <FieldErrorMsg>{flatErrors.ccmInvolvment}</FieldErrorMsg>

                      {Object.keys(CcmInvolvmentType)
                        .sort(sortOtherEnum)
                        .map(type => {
                          return (
                            <Fragment key={type}>
                              <Field
                                as={CheckboxField}
                                id={`ops-eval-and-learning-cmmi-involvement-${type}`}
                                name="ccmInvolvment"
                                label={translateCcmInvolvmentType(type)}
                                value={type}
                                checked={values?.ccmInvolvment.includes(
                                  type as CcmInvolvmentType
                                )}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  if (e.target.checked) {
                                    arrayHelpers.push(e.target.value);
                                  } else {
                                    const idx = values.ccmInvolvment.indexOf(
                                      e.target.value as CcmInvolvmentType
                                    );
                                    arrayHelpers.remove(idx);
                                  }
                                }}
                              />
                              {type === CcmInvolvmentType.OTHER &&
                                values.ccmInvolvment.includes(type) && (
                                  <div className="margin-left-4 margin-top-neg-2">
                                    <Label
                                      htmlFor="ops-eval-and-learning-cmmi-involvement-other"
                                      className="text-normal"
                                    >
                                      {h('pleaseSpecify')}
                                    </Label>
                                    <FieldErrorMsg>
                                      {flatErrors.ccmInvolvmentOther}
                                    </FieldErrorMsg>
                                    <Field
                                      as={TextAreaField}
                                      className="maxw-none mint-textarea"
                                      id="ops-eval-and-learning-cmmi-involvement-other"
                                      maxLength={5000}
                                      name="ccmInvolvmentOther"
                                    />
                                  </div>
                                )}
                            </Fragment>
                          );
                        })}
                      <AddNote
                        id="ops-eval-and-learning-cmmi-involvement-note"
                        field="ccmInvolvmentNote"
                      />
                    </>
                  )}
                />

                <FieldGroup
                  scrollElement="dataNeededForMonitoring"
                  error={!!flatErrors.dataNeededForMonitoring}
                  className="margin-top-4"
                >
                  <Label
                    htmlFor="ops-eval-and-learning-data-needed"
                    id="label-ops-eval-and-learning-data-needed"
                    className="maxw-none"
                  >
                    {t('dataNeeded')}
                  </Label>
                  {itSolutionsStarted && (
                    <ITSolutionsWarning
                      id="ops-eval-and-learning-data-needed-warning"
                      onClick={() =>
                        handleFormSubmit(
                          `/models/${modelID}/task-list/it-solutions`
                        )
                      }
                    />
                  )}

                  <p className="text-base margin-y-1">{t('dataNeededInfo')}</p>

                  <FieldErrorMsg>
                    {flatErrors.dataNeededForMonitoring}
                  </FieldErrorMsg>
                  <Field
                    as={MultiSelect}
                    id="ops-eval-and-learning-data-needed"
                    name="dataNeededForMonitoring"
                    ariaLabel="label-ops-eval-and-learning-data-needed"
                    options={mapMultiSelectOptions(
                      translateDataForMonitoringType,
                      DataForMonitoringType
                    )}
                    selectedLabel={t('selectedData')}
                    onChange={(value: string[] | []) => {
                      setFieldValue('dataNeededForMonitoring', value);
                    }}
                    initialValues={initialValues.dataNeededForMonitoring}
                  />
                  {(values?.dataNeededForMonitoring || []).includes(
                    DataForMonitoringType.OTHER
                  ) && (
                    <div className="margin-top-2">
                      <Label
                        htmlFor="ops-eval-and-learning-data-needed-other"
                        className="text-normal"
                      >
                        {t('dataNeededOther')}
                      </Label>
                      <FieldErrorMsg>
                        {flatErrors.dataNeededForMonitoringOther}
                      </FieldErrorMsg>
                      <Field
                        as={TextInput}
                        maxLength={50}
                        error={flatErrors.dataNeededForMonitoringOther}
                        id="ops-eval-and-learning-data-needed-other"
                        name="dataNeededForMonitoringOther"
                      />
                    </div>
                  )}

                  <AddNote
                    id="ops-eval-and-learning-data-needed-note"
                    field="dataNeededForMonitoringNote"
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="dataToSendParticicipants"
                  error={!!flatErrors.dataToSendParticicipants}
                  className="margin-top-4"
                >
                  <Label
                    htmlFor="ops-eval-and-learning-data-to-send"
                    id="ops-eval-and-learning-data-to-send"
                    className="maxw-none"
                  >
                    {t('dataToSend')}
                  </Label>
                  {itSolutionsStarted && (
                    <ITSolutionsWarning
                      id="ops-eval-and-learning-data-to-send-warning"
                      onClick={() =>
                        handleFormSubmit(
                          `/models/${modelID}/task-list/it-solutions`
                        )
                      }
                    />
                  )}

                  <FieldErrorMsg>
                    {flatErrors.dataToSendParticicipants}
                  </FieldErrorMsg>
                  <Field
                    as={MultiSelect}
                    id="ops-eval-and-learning-data-to-send"
                    name="dataToSendParticicipants"
                    ariaLabel="label-ops-eval-and-learning-data-to-send"
                    options={mapMultiSelectOptions(
                      translateDataToSendParticipantsType,
                      DataToSendParticipantsType
                    )}
                    selectedLabel={t('selectedData')}
                    onChange={(value: string[] | []) => {
                      setFieldValue('dataToSendParticicipants', value);
                    }}
                    initialValues={initialValues.dataToSendParticicipants}
                  />
                  {(values?.dataToSendParticicipants || []).includes(
                    DataToSendParticipantsType.OTHER_MIPS_DATA
                  ) && (
                    <div className="margin-top-2">
                      <Label
                        htmlFor="ops-eval-and-learning-data-to-send-other"
                        className="text-normal"
                      >
                        {t('dataToSendOther')}
                      </Label>
                      <FieldErrorMsg>
                        {flatErrors.dataToSendParticicipantsgOther}
                      </FieldErrorMsg>
                      <Field
                        as={TextInput}
                        maxLength={50}
                        error={flatErrors.dataToSendParticicipantsOther}
                        id="ops-eval-and-learning-data-to-send-other"
                        name="dataToSendParticicipantsOther"
                      />
                    </div>
                  )}

                  <AddNote
                    id="ops-eval-and-learning-data-to-send-note"
                    field="dataToSendParticicipantsNote"
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="shareCclfData"
                  error={!!flatErrors.shareCclfData}
                  className="margin-top-6"
                >
                  <Label
                    htmlFor="ops-eval-and-learning-share-cclf-data"
                    className="maxw-none"
                  >
                    {t('claimLineFeed')}
                  </Label>

                  <FieldErrorMsg>{flatErrors.shareCclfData}</FieldErrorMsg>
                  <Fieldset>
                    {[true, false].map(key => (
                      <Field
                        as={Radio}
                        key={key}
                        id={`ops-eval-and-learning-share-cclf-data-${key}`}
                        data-testid={`ops-eval-and-learning-share-cclf-data-${key}`}
                        name="shareCclfData"
                        label={key ? h('yes') : h('no')}
                        value={key ? 'YES' : 'NO'}
                        checked={values.shareCclfData === key}
                        onChange={() => {
                          setFieldValue('shareCclfData', key);
                        }}
                      />
                    ))}
                  </Fieldset>

                  <AddNote
                    id="ops-eval-and-learning-share-cclf-data-note"
                    field="shareCclfDataNote"
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
            6,
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

export default Evaluation;
