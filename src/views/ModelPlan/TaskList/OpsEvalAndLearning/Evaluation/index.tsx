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
  IconArrowBack,
  Label,
  Radio
} from '@trussworks/react-uswds';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import GetEvaluation from 'queries/OpsEvalAndLearning/GetEvaluation';
import {
  GetEvaluation as GetEvaluationType,
  GetEvaluation_modelPlan_opsEvalAndLearning as EvaluationFormType
} from 'queries/OpsEvalAndLearning/types/GetEvaluation';
import { UpdateModelPlanOpsEvalAndLearningVariables } from 'queries/types/UpdateModelPlanOpsEvalAndLearning';
import UpdateModelPlanOpsEvalAndLearning from 'queries/UpdateModelPlanOpsEvalAndLearning';
import {
  CcmInvolvmentType,
  DataForMonitoringType,
  DataToSendParticipantsType,
  EvaluationApproachType
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import {
  sortOtherEnum,
  translateCcmInvolvmentType,
  translateDataForMonitoringType,
  translateDataToSendParticipantsType,
  translateEvaluationApproachType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import { isCCWInvolvement, renderCurrentPage, renderTotalPages } from '..';

const Evaluation = () => {
  const { t } = useTranslation('operationsEvaluationAndLearning');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<EvaluationFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<GetEvaluationType>(GetEvaluation, {
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

  const [update] = useMutation<UpdateModelPlanOpsEvalAndLearningVariables>(
    UpdateModelPlanOpsEvalAndLearning
  );

  const handleFormSubmit = (
    formikValues: EvaluationFormType,
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
            if (isCCWInvolvement(formikValues.ccmInvolvment)) {
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
        <Trans i18nKey="modelPlanTaskList:subheading">
          indexZero {modelName} indexTwo
        </Trans>
      </p>
      <p className="margin-bottom-2 font-body-md line-height-sans-4">
        {h('helpText')}
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
                className="tablet:grid-col-6 margin-top-6"
                data-testid="ops-eval-and-learning-evaluation-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                {/* <FieldArray
                  name="providerLeaveMethod"
                  render={arrayHelpers => (
                    <>
                      <legend className="usa-label">
                        {t('canProvidersLeave')}
                      </legend>
                      <p className="text-base margin-0 line-height-body-3">
                        {t('canProvidersLeaveInfo')}
                      </p>
                      <FieldErrorMsg>
                        {flatErrors.providerLeaveMethod}
                      </FieldErrorMsg>

                      {Object.keys(ProviderLeaveType)
                        .sort(sortOtherEnum)
                        .map(type => {
                          return (
                            <Fragment key={type}>
                              <Field
                                as={CheckboxField}
                                id={`participants-and-providers-leave-method-${type}`}
                                name="providerLeaveMethod"
                                label={translateProviderLeaveType(type)}
                                value={type}
                                checked={values?.providerLeaveMethod.includes(
                                  type as ProviderLeaveType
                                )}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  if (e.target.checked) {
                                    arrayHelpers.push(e.target.value);
                                  } else {
                                    const idx = values.providerLeaveMethod.indexOf(
                                      e.target.value as ProviderLeaveType
                                    );
                                    arrayHelpers.remove(idx);
                                  }
                                }}
                              />
                              {type === ('OTHER' as ProviderLeaveType) &&
                                values.providerLeaveMethod.includes(type) && (
                                  <div className="margin-left-4 margin-top-neg-2">
                                    <Label
                                      htmlFor="participants-and-providers-leave-method-other"
                                      className="text-normal"
                                    >
                                      {h('pleaseSpecify')}
                                    </Label>
                                    <FieldErrorMsg>
                                      {flatErrors.providerLeaveMethodOther}
                                    </FieldErrorMsg>
                                    <Field
                                      as={TextInput}
                                      className="maxw-none"
                                      id="participants-and-providers-leave-method-other"
                                      maxLength={50}
                                      name="providerLeaveMethodOther"
                                    />
                                  </div>
                                )}
                            </Fragment>
                          );
                        })}
                      <AddNote
                        id="participants-and-providers-leave-method-note"
                        field="providerLeaveMethodNote"
                      />
                    </>
                  )}
                /> */}

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
      {data && (
        <PageNumber
          currentPage={renderCurrentPage(
            6,
            iddocSupport,
            isCCWInvolvement(ccmInvolvment)
          )}
          totalPages={renderTotalPages(
            iddocSupport,
            isCCWInvolvement(ccmInvolvment)
          )}
          className="margin-y-6"
        />
      )}
    </>
  );
};

export default Evaluation;
