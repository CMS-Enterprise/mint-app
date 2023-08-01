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
  Radio
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import ITSolutionsWarning from 'components/ITSolutionsWarning';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import TextAreaField from 'components/shared/TextAreaField';
import useScrollElement from 'hooks/useScrollElement';
import GetCCWAndQuality from 'queries/OpsEvalAndLearning/GetCCWAndQuality';
import {
  GetCCWAndQuality as GetCCWAndQualityType,
  GetCCWAndQuality_modelPlan_opsEvalAndLearning as GetCCWAndQualityFormType,
  GetCCWAndQualityVariables
} from 'queries/OpsEvalAndLearning/types/GetCCWAndQuality';
import { UpdatePlanOpsEvalAndLearningVariables } from 'queries/OpsEvalAndLearning/types/UpdatePlanOpsEvalAndLearning';
import UpdatePlanOpsEvalAndLearning from 'queries/OpsEvalAndLearning/UpdatePlanOpsEvalAndLearning';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import { NotFoundPartial } from 'views/NotFound';

import {
  isCCWInvolvement,
  isQualityMeasures,
  renderCurrentPage,
  renderTotalPages
} from '..';

const CCWAndQuality = () => {
  const { t } = useTranslation('operationsEvaluationAndLearning');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<GetCCWAndQualityFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetCCWAndQualityType,
    GetCCWAndQualityVariables
  >(GetCCWAndQuality, {
    variables: {
      id: modelID
    }
  });

  const {
    id,
    iddocSupport,
    ccmInvolvment,
    dataNeededForMonitoring,
    sendFilesBetweenCcw,
    sendFilesBetweenCcwNote,
    appToSendFilesToKnown,
    appToSendFilesToWhich,
    appToSendFilesToNote,
    useCcwForFileDistribiutionToParticipants,
    useCcwForFileDistribiutionToParticipantsNote,
    developNewQualityMeasures,
    developNewQualityMeasuresNote,
    qualityPerformanceImpactsPayment,
    qualityPerformanceImpactsPaymentNote
  } = data?.modelPlan?.opsEvalAndLearning || ({} as GetCCWAndQualityFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const itSolutionsStarted: boolean = !!data?.modelPlan.operationalNeeds.find(
    need => need.modifiedDts
  );

  // If redirected from IT Solutions, scrolls to the relevant question
  useScrollElement(!loading);

  const [update] = useMutation<UpdatePlanOpsEvalAndLearningVariables>(
    UpdatePlanOpsEvalAndLearning
  );

  const handleFormSubmit = (redirect?: string) => {
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
              `/models/${modelID}/task-list/ops-eval-and-learning/data-sharing`
            );
          } else if (redirect === 'back') {
            history.push(
              `/models/${modelID}/task-list/ops-eval-and-learning/evaluation`
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

  const initialValues: GetCCWAndQualityFormType = {
    __typename: 'PlanOpsEvalAndLearning',
    id: id ?? '',
    iddocSupport: iddocSupport ?? null,
    ccmInvolvment: ccmInvolvment ?? [],
    dataNeededForMonitoring: dataNeededForMonitoring ?? [],
    sendFilesBetweenCcw: sendFilesBetweenCcw ?? null,
    sendFilesBetweenCcwNote: sendFilesBetweenCcwNote ?? '',
    appToSendFilesToKnown: appToSendFilesToKnown ?? null,
    appToSendFilesToWhich: appToSendFilesToWhich ?? '',
    appToSendFilesToNote: appToSendFilesToNote ?? '',
    useCcwForFileDistribiutionToParticipants:
      useCcwForFileDistribiutionToParticipants ?? null,
    useCcwForFileDistribiutionToParticipantsNote:
      useCcwForFileDistribiutionToParticipantsNote ?? '',
    developNewQualityMeasures: developNewQualityMeasures ?? null,
    developNewQualityMeasuresNote: developNewQualityMeasuresNote ?? '',
    qualityPerformanceImpactsPayment: qualityPerformanceImpactsPayment ?? null,
    qualityPerformanceImpactsPaymentNote:
      qualityPerformanceImpactsPaymentNote ?? ''
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
        {(formikProps: FormikProps<GetCCWAndQualityFormType>) => {
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
                data-testid="ops-eval-and-learning-ccw-and-quality-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={!!error || loading}>
                  {isCCWInvolvement(ccmInvolvment) && (
                    <>
                      <h3>{t('ccwSpecific')}</h3>

                      <FieldGroup
                        scrollElement="sendFilesBetweenCcw"
                        error={!!flatErrors.sendFilesBetweenCcw}
                      >
                        <Label
                          htmlFor="ops-eval-and-learning-send-files"
                          className="maxw-none"
                        >
                          {t('ccwSendFiles')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.sendFilesBetweenCcw}
                        </FieldErrorMsg>
                        <Fieldset>
                          {[true, false].map(key => (
                            <Field
                              as={Radio}
                              key={key}
                              id={`ops-eval-and-learning-send-files-${key}`}
                              name="sendFilesBetweenCcw"
                              label={key ? h('yes') : h('no')}
                              value={key ? 'YES' : 'NO'}
                              checked={values.sendFilesBetweenCcw === key}
                              onChange={() => {
                                setFieldValue('sendFilesBetweenCcw', key);
                              }}
                            />
                          ))}
                        </Fieldset>

                        <AddNote
                          id="ops-eval-and-learning-send-files-note"
                          field="sendFilesBetweenCcwNote"
                        />
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="appToSendFilesToKnown"
                        error={!!flatErrors.appToSendFilesToKnown}
                      >
                        <Label
                          htmlFor="ops-eval-and-learning-app-to-send-files"
                          className="maxw-none"
                        >
                          {t('fileTransfers')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.appToSendFilesToKnown}
                        </FieldErrorMsg>
                        <Fieldset>
                          {[true, false].map(key => (
                            <Fragment key={key.toString()}>
                              <Field
                                as={Radio}
                                key={key}
                                id={`ops-eval-and-learning-app-to-send-files-${key}`}
                                name="appToSendFilesToKnown"
                                label={key ? h('yes') : h('no')}
                                value={key ? 'YES' : 'NO'}
                                checked={values.appToSendFilesToKnown === key}
                                onChange={() => {
                                  setFieldValue('appToSendFilesToKnown', key);
                                }}
                              />
                              {key === true &&
                                values.appToSendFilesToKnown === key && (
                                  <div className="margin-left-4 margin-top-1">
                                    <Label
                                      htmlFor="ops-eval-and-learning-app-to-send-files-which"
                                      className="text-normal"
                                    >
                                      {h('pleaseSpecify')}
                                    </Label>
                                    <FieldErrorMsg>
                                      {flatErrors.appToSendFilesToWhich}
                                    </FieldErrorMsg>
                                    <Field
                                      as={TextAreaField}
                                      className="maxw-none mint-textarea"
                                      id="ops-eval-and-learning-app-to-send-files-which"
                                      maxLength={5000}
                                      name="appToSendFilesToWhich"
                                    />
                                  </div>
                                )}
                            </Fragment>
                          ))}
                        </Fieldset>

                        <AddNote
                          id="ops-eval-and-learning-app-to-distribute-files-note"
                          field="appToSendFilesToNote"
                        />
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="useCcwForFileDistribiutionToParticipants"
                        error={
                          !!flatErrors.useCcwForFileDistribiutionToParticipants
                        }
                      >
                        <Label
                          htmlFor="ops-eval-and-learning-distribute-files"
                          className="maxw-none"
                        >
                          {t('distributeFiles')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.useCcwForFileDistribiutionToParticipants}
                        </FieldErrorMsg>
                        <Fieldset>
                          {[true, false].map(key => (
                            <Field
                              as={Radio}
                              key={key}
                              id={`ops-eval-and-learning-distribute-files-${key}`}
                              name="useCcwForFileDistribiutionToParticipants"
                              label={key ? h('yes') : h('no')}
                              value={key ? 'YES' : 'NO'}
                              checked={
                                values.useCcwForFileDistribiutionToParticipants ===
                                key
                              }
                              onChange={() => {
                                setFieldValue(
                                  'useCcwForFileDistribiutionToParticipants',
                                  key
                                );
                              }}
                            />
                          ))}
                        </Fieldset>

                        <AddNote
                          id="ops-eval-and-learning-distribute-files-note"
                          field="useCcwForFileDistribiutionToParticipantsNote"
                        />
                      </FieldGroup>
                    </>
                  )}

                  {isQualityMeasures(dataNeededForMonitoring) && (
                    <>
                      <h3>{t('qualityQuestions')}</h3>

                      <FieldGroup
                        scrollElement="developNewQualityMeasures"
                        error={!!flatErrors.developNewQualityMeasures}
                      >
                        <Label
                          htmlFor="ops-eval-and-learning-develop-measures"
                          className="maxw-none"
                        >
                          {t('validatedQuality')}
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

                        <FieldErrorMsg>
                          {flatErrors.developNewQualityMeasures}
                        </FieldErrorMsg>
                        <Fieldset>
                          {[true, false].map(key => (
                            <Field
                              as={Radio}
                              key={key}
                              id={`ops-eval-and-learning-develop-measures-${key}`}
                              name="developNewQualityMeasures"
                              label={key ? h('yes') : h('no')}
                              value={key ? 'YES' : 'NO'}
                              checked={values.developNewQualityMeasures === key}
                              onChange={() => {
                                setFieldValue('developNewQualityMeasures', key);
                              }}
                            />
                          ))}
                        </Fieldset>

                        <AddNote
                          id="ops-eval-and-learning-develop-measures-note"
                          field="developNewQualityMeasuresNote"
                        />
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="qualityPerformanceImpactsPayment"
                        error={!!flatErrors.qualityPerformanceImpactsPayment}
                      >
                        <Label
                          htmlFor="ops-eval-and-learning-performance-impact"
                          className="maxw-none"
                        >
                          {t('impactPayment')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.qualityPerformanceImpactsPayment}
                        </FieldErrorMsg>
                        <Fieldset>
                          {[true, false].map(key => (
                            <Field
                              as={Radio}
                              key={key}
                              id={`ops-eval-and-learning-performance-impact-${key}`}
                              data-testid={`ops-eval-and-learning-performance-impact-${key}`}
                              name="qualityPerformanceImpactsPayment"
                              label={key ? h('yes') : h('no')}
                              value={key ? 'YES' : 'NO'}
                              checked={
                                values.qualityPerformanceImpactsPayment === key
                              }
                              onChange={() => {
                                setFieldValue(
                                  'qualityPerformanceImpactsPayment',
                                  key
                                );
                              }}
                            />
                          ))}
                        </Fieldset>

                        <AddNote
                          id="ops-eval-and-learning-performance-impact-note"
                          field="qualityPerformanceImpactsPaymentNote"
                        />
                      </FieldGroup>
                    </>
                  )}

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
                </Fieldset>
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
            7,
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

export default CCWAndQuality;
