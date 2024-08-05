import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Fieldset,
  Icon,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  CcmInvolvmentType,
  DataForMonitoringType,
  DataToSendParticipantsType,
  EvaluationApproachType,
  GetEvaluationQuery,
  TypedUpdatePlanOpsEvalAndLearningDocument,
  useGetEvaluationQuery
} from 'gql/gen/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import ConfirmLeave from 'components/ConfirmLeave';
import ITSolutionsWarning from 'components/ITSolutionsWarning';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import useScrollElement from 'hooks/useScrollElement';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { composeMultiSelectOptions } from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import {
  isCCWInvolvement,
  isQualityMeasures,
  renderCurrentPage,
  renderTotalPages
} from '..';

type EvaluationFormType = GetEvaluationQuery['modelPlan']['opsEvalAndLearning'];

const Evaluation = () => {
  const { t: opsEvalAndLearningT } = useTranslation('opsEvalAndLearning');

  const { t: opsEvalAndLearningMiscT } = useTranslation(
    'opsEvalAndLearningMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    evaluationApproaches: evaluationApproachesConfig,
    ccmInvolvment: ccmInvolvmentConfig,
    dataNeededForMonitoring: dataNeededForMonitoringConfig,
    dataToSendParticicipants: dataToSendParticicipantsConfig,
    shareCclfData: shareCclfDataConfig
  } = usePlanTranslation('opsEvalAndLearning');

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<EvaluationFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useGetEvaluationQuery({
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
  } = (data?.modelPlan?.opsEvalAndLearning || {}) as EvaluationFormType;

  const modelName = data?.modelPlan?.modelName || '';

  const itSolutionsStarted: boolean = !!data?.modelPlan.operationalNeeds.find(
    need => need.modifiedDts
  );

  // If redirected from Operational Solutions, scrolls to the relevant question
  useScrollElement(!loading);

  const { mutationError } = useHandleMutation(
    TypedUpdatePlanOpsEvalAndLearningDocument,
    {
      id,
      formikRef
    }
  );

  const nextPage = () => {
    if (
      isCCWInvolvement(formikRef?.current?.values.ccmInvolvment) ||
      isQualityMeasures(formikRef?.current?.values.dataNeededForMonitoring)
    ) {
      history.push(
        `/models/${modelID}/task-list/ops-eval-and-learning/ccw-and-quality`
      );
    } else {
      history.push(
        `/models/${modelID}/task-list/ops-eval-and-learning/data-sharing`
      );
    }
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
      <MutationErrorModal
        isOpen={mutationError.isModalOpen}
        closeModal={() => mutationError.setIsModalOpen(false)}
        url={mutationError.destinationURL}
      />

      <BreadcrumbBar variant="wrap">
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to="/">
            <span>{miscellaneousT('home')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to={`/models/${modelID}/task-list/`}>
            <span>{miscellaneousT('tasklistBreadcrumb')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>{opsEvalAndLearningMiscT('breadcrumb')}</Breadcrumb>
      </BreadcrumbBar>
      <PageHeading className="margin-top-4 margin-bottom-2">
        {opsEvalAndLearningMiscT('heading')}
      </PageHeading>

      <p
        className="margin-top-0 margin-bottom-1 font-body-lg"
        data-testid="model-plan-name"
      >
        {miscellaneousT('for')} {modelName}
      </p>

      <p className="margin-bottom-2 font-body-md line-height-sans-4">
        {miscellaneousT('helpText')}
      </p>

      <AskAQuestion modelID={modelID} />

      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          nextPage();
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
              {getKeys(errors).length > 0 && (
                <ErrorAlert
                  testId="formik-validation-errors"
                  classNames="margin-top-3"
                  heading={miscellaneousT('checkAndFix')}
                >
                  {getKeys(flatErrors).map(key => {
                    return (
                      <ErrorAlertMessage
                        key={`Error.${key}`}
                        errorKey={`${key}`}
                        message={flatErrors[key]}
                      />
                    );
                  })}
                </ErrorAlert>
              )}

              <ConfirmLeave />

              <Form
                className="desktop:grid-col-6 margin-top-6"
                data-testid="ops-eval-and-learning-evaluation-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={!!error || loading}>
                  <FieldGroup
                    scrollElement="ops-eval-and-learning-evaluation-approach"
                    error={!!flatErrors.evaluationApproaches}
                  >
                    <Label
                      htmlFor="ops-eval-and-learning-evaluation-approach"
                      id="ops-eval-and-learning-evaluation-approach"
                      className="maxw-none"
                    >
                      {opsEvalAndLearningT('evaluationApproaches.label')}
                    </Label>

                    {itSolutionsStarted && (
                      <ITSolutionsWarning
                        id="ops-eval-and-learning-evaluation-approach-warning"
                        onClick={() =>
                          history.push(
                            `/models/${modelID}/task-list/it-solutions`
                          )
                        }
                      />
                    )}

                    <FieldErrorMsg>
                      {flatErrors.evaluationApproaches}
                    </FieldErrorMsg>

                    {getKeys(evaluationApproachesConfig.options).map(type => {
                      return (
                        <Fragment key={type}>
                          <Field
                            as={CheckboxField}
                            id={`ops-eval-and-learning-evaluation-approach-${type}`}
                            data-testid={`ops-eval-and-learning-evaluation-approach-${type}`}
                            name="evaluationApproaches"
                            label={evaluationApproachesConfig.options[type]}
                            value={type}
                            checked={values?.evaluationApproaches.includes(
                              type
                            )}
                          />

                          {type === EvaluationApproachType.OTHER &&
                            values.evaluationApproaches.includes(
                              EvaluationApproachType.OTHER
                            ) && (
                              <div className="margin-left-4">
                                <Label
                                  htmlFor="ops-eval-and-learning-evaluation-approach-other"
                                  className="text-normal maxw-none"
                                >
                                  {opsEvalAndLearningT(
                                    'evaluationApproachOther.label'
                                  )}
                                </Label>

                                <FieldErrorMsg>
                                  {flatErrors.evaluationApproachOther}
                                </FieldErrorMsg>

                                <Field
                                  as={TextInput}
                                  id="ops-eval-and-learning-evaluation-approach-other"
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
                  </FieldGroup>

                  <FieldGroup scrollElement="ops-eval-and-learning-cmmi-involvement">
                    <Label
                      htmlFor="ops-eval-and-learning-cmmi-involvement"
                      id="ops-eval-and-learning-cmmi-involvement"
                      className="maxw-none"
                    >
                      {opsEvalAndLearningT('ccmInvolvment.label')}
                    </Label>

                    <p className="text-base margin-y-1">
                      {opsEvalAndLearningT('ccmInvolvment.sublabel')}
                    </p>

                    <FieldErrorMsg>{flatErrors.ccmInvolvment}</FieldErrorMsg>

                    {getKeys(ccmInvolvmentConfig.options).map(type => {
                      return (
                        <Fragment key={type}>
                          <Field
                            as={CheckboxField}
                            id={`ops-eval-and-learning-cmmi-involvement-${type}`}
                            name="ccmInvolvment"
                            label={ccmInvolvmentConfig.options[type]}
                            value={type}
                            checked={values?.ccmInvolvment.includes(type)}
                          />
                          {type === CcmInvolvmentType.OTHER &&
                            values.ccmInvolvment.includes(
                              CcmInvolvmentType.OTHER
                            ) && (
                              <div className="margin-left-4 margin-top-neg-2">
                                <Label
                                  htmlFor="ops-eval-and-learning-cmmi-involvement-other"
                                  className="text-normal"
                                >
                                  {opsEvalAndLearningT(
                                    'ccmInvolvmentOther.label'
                                  )}
                                </Label>

                                <FieldErrorMsg>
                                  {flatErrors.ccmInvolvmentOther}
                                </FieldErrorMsg>

                                <Field
                                  as={TextInput}
                                  id="ops-eval-and-learning-cmmi-involvement-other"
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
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="ops-eval-and-learning-data-needed"
                    error={!!flatErrors.dataNeededForMonitoring}
                    className="margin-top-4"
                  >
                    <Label
                      htmlFor="ops-eval-and-learning-data-needed"
                      id="label-ops-eval-and-learning-data-needed"
                      className="maxw-none"
                    >
                      {opsEvalAndLearningT('dataNeededForMonitoring.label')}
                    </Label>

                    {itSolutionsStarted && (
                      <ITSolutionsWarning
                        id="ops-eval-and-learning-data-needed-warning"
                        onClick={() =>
                          history.push(
                            `/models/${modelID}/task-list/it-solutions`
                          )
                        }
                      />
                    )}

                    <p className="text-base margin-y-1">
                      {opsEvalAndLearningT('dataNeededForMonitoring.sublabel')}
                    </p>

                    <FieldErrorMsg>
                      {flatErrors.dataNeededForMonitoring}
                    </FieldErrorMsg>

                    <Field
                      as={MultiSelect}
                      id="ops-eval-and-learning-data-needed"
                      name="dataNeededForMonitoring"
                      ariaLabel="label-ops-eval-and-learning-data-needed"
                      options={composeMultiSelectOptions(
                        dataNeededForMonitoringConfig.options
                      )}
                      selectedLabel={opsEvalAndLearningT(
                        'dataNeededForMonitoring.multiSelectLabel'
                      )}
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
                          {opsEvalAndLearningT(
                            'dataNeededForMonitoringOther.label'
                          )}
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
                    scrollElement="label-ops-eval-and-learning-data-to-send"
                    error={!!flatErrors.dataToSendParticicipants}
                    className="margin-top-4"
                  >
                    <Label
                      htmlFor="ops-eval-and-learning-data-to-send"
                      id="label-ops-eval-and-learning-data-to-send"
                      className="maxw-none"
                    >
                      {opsEvalAndLearningT('dataToSendParticicipants.label')}
                    </Label>

                    {itSolutionsStarted && (
                      <ITSolutionsWarning
                        id="ops-eval-and-learning-data-to-send-warning"
                        onClick={() =>
                          history.push(
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
                      options={composeMultiSelectOptions(
                        dataToSendParticicipantsConfig.options
                      )}
                      selectedLabel={opsEvalAndLearningT(
                        'dataToSendParticicipants.multiSelectLabel'
                      )}
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
                          {opsEvalAndLearningT(
                            'dataToSendParticicipantsOther.label'
                          )}
                        </Label>

                        <FieldErrorMsg>
                          {flatErrors.dataToSendParticicipantsOther}
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
                    scrollElement="ops-eval-and-learning-share-cclf-data"
                    error={!!flatErrors.shareCclfData}
                    className="margin-top-6"
                  >
                    <Label
                      htmlFor="ops-eval-and-learning-share-cclf-data"
                      className="maxw-none"
                    >
                      {opsEvalAndLearningT('shareCclfData.label')}
                    </Label>

                    <FieldErrorMsg>{flatErrors.shareCclfData}</FieldErrorMsg>

                    <BooleanRadio
                      field="shareCclfData"
                      id="ops-eval-and-learning-share-cclf-data"
                      value={values.shareCclfData}
                      setFieldValue={setFieldValue}
                      options={shareCclfDataConfig.options}
                    />

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
                        history.push(
                          `/models/${modelID}/task-list/ops-eval-and-learning/performance`
                        );
                      }}
                    >
                      {miscellaneousT('back')}
                    </Button>

                    <Button type="submit" onClick={() => setErrors({})}>
                      {miscellaneousT('next')}
                    </Button>
                  </div>

                  <Button
                    type="button"
                    className="usa-button usa-button--unstyled"
                    onClick={() => history.push(`/models/${modelID}/task-list`)}
                  >
                    <Icon.ArrowBack className="margin-right-1" aria-hidden />

                    {miscellaneousT('saveAndReturn')}
                  </Button>
                </Fieldset>
              </Form>
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
