import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Icon,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import { Field, Formik, FormikProps } from 'formik';
import {
  CcmInvolvmentType,
  DataForMonitoringType,
  DataToSendParticipantsType,
  EvaluationApproachType,
  GetEvaluationQuery,
  TypedUpdatePlanOpsEvalAndLearningDocument,
  useGetEvaluationQuery
} from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import CheckboxField from 'components/CheckboxField';
import ConfirmLeave from 'components/ConfirmLeave';
import FieldGroup from 'components/FieldGroup';
import MTOWarning from 'components/MTOWarning';
import MultiSelect from 'components/MultiSelect';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import useScrollElement from 'hooks/useScrollElement';
import { getKeys } from 'types/translation';
import { composeMultiSelectOptions } from 'utils/modelPlan';

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

  const { modelID = '' } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<EvaluationFormType>>(null);
  const navigate = useNavigate();

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

  // If redirected from Operational Solutions, scrolls to the relevant question
  useScrollElement(!loading);

  const { mutationError } = useHandleMutation(
    TypedUpdatePlanOpsEvalAndLearningDocument,
    {
      id,
      formikRef: formikRef as any
    }
  );

  const nextPage = () => {
    if (
      isCCWInvolvement(formikRef?.current?.values.ccmInvolvment) ||
      isQualityMeasures(formikRef?.current?.values.dataNeededForMonitoring)
    ) {
      navigate(
        `/models/${modelID}/collaboration-area/task-list/ops-eval-and-learning/ccw-and-quality`
      );
    } else {
      navigate(
        `/models/${modelID}/collaboration-area/task-list/ops-eval-and-learning/data-sharing`
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
        closeModal={() => mutationError.closeModal()}
        url={mutationError.destinationURL}
      />

      <Breadcrumbs
        items={[
          BreadcrumbItemOptions.HOME,
          BreadcrumbItemOptions.COLLABORATION_AREA,
          BreadcrumbItemOptions.TASK_LIST,
          BreadcrumbItemOptions.OPS_EVAL_AND_LEARNING
        ]}
      />

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
          const { handleSubmit, setErrors, values, setFieldValue } =
            formikProps;

          return (
            <>
              <ConfirmLeave />

              <form
                className="desktop:grid-col-6 margin-top-6"
                data-testid="ops-eval-and-learning-evaluation-form"
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={!!error || loading}>
                  <FieldGroup scrollElement="evaluationApproaches">
                    <Label
                      htmlFor="ops-eval-and-learning-evaluation-approach"
                      id="ops-eval-and-learning-evaluation-approach"
                      className="maxw-none"
                    >
                      {opsEvalAndLearningT('evaluationApproaches.label')}
                    </Label>

                    <MTOWarning id="ops-eval-and-learning-evaluation-approach-warning" />

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

                  <FieldGroup>
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
                    className="margin-top-4"
                    scrollElement="dataNeededForMonitoring"
                  >
                    <Label
                      htmlFor="ops-eval-and-learning-data-needed"
                      id="label-ops-eval-and-learning-data-needed"
                      className="maxw-none"
                    >
                      {opsEvalAndLearningT('dataNeededForMonitoring.label')}
                    </Label>

                    <MTOWarning id="ops-eval-and-learning-data-needed-warning" />

                    <p className="text-base margin-y-1">
                      {opsEvalAndLearningT('dataNeededForMonitoring.sublabel')}
                    </p>

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

                        <Field
                          as={TextInput}
                          maxLength={50}
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
                    className="margin-top-4"
                    scrollElement="dataToSendParticicipants"
                  >
                    <Label
                      htmlFor="ops-eval-and-learning-data-to-send"
                      id="label-ops-eval-and-learning-data-to-send"
                      className="maxw-none"
                    >
                      {opsEvalAndLearningT('dataToSendParticicipants.label')}
                    </Label>

                    <MTOWarning id="ops-eval-and-learning-data-to-send-warning" />

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

                        <Field
                          as={TextInput}
                          maxLength={50}
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

                  <FieldGroup className="margin-top-6">
                    <Label
                      htmlFor="ops-eval-and-learning-share-cclf-data"
                      className="maxw-none"
                    >
                      {opsEvalAndLearningT('shareCclfData.label')}
                    </Label>

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
                        navigate(
                          `/models/${modelID}/collaboration-area/task-list/ops-eval-and-learning/performance`
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
                    onClick={() =>
                      navigate(
                        `/models/${modelID}/collaboration-area/task-list`
                      )
                    }
                  >
                    <Icon.ArrowBack
                      className="margin-right-1"
                      aria-hidden
                      aria-label="back"
                    />

                    {miscellaneousT('saveAndReturn')}
                  </Button>
                </Fieldset>
              </form>
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
