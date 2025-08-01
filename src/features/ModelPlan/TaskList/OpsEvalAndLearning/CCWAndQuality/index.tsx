import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Icon,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  GetCcwAndQualityQuery,
  TypedUpdatePlanOpsEvalAndLearningDocument,
  useGetCcwAndQualityQuery,
  YesNoOtherType
} from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import FieldGroup from 'components/FieldGroup';
import MTOWarning from 'components/MTOWarning';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import TextAreaField from 'components/TextAreaField';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import useScrollElement from 'hooks/useScrollElement';
import { getKeys } from 'types/translation';

import {
  isCCWInvolvement,
  isQualityMeasures,
  renderCurrentPage,
  renderTotalPages
} from '..';

type GetCCWAndQualityFormType =
  GetCcwAndQualityQuery['modelPlan']['opsEvalAndLearning'];

const CCWAndQuality = () => {
  const { t: opsEvalAndLearningT } = useTranslation('opsEvalAndLearning');

  const { t: opsEvalAndLearningMiscT } = useTranslation(
    'opsEvalAndLearningMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    sendFilesBetweenCcw: sendFilesBetweenCcwConfig,
    appToSendFilesToKnown: appToSendFilesToKnownConfig,
    useCcwForFileDistribiutionToParticipants:
      useCcwForFileDistribiutionToParticipantsConfig,
    developNewQualityMeasures: developNewQualityMeasuresConfig,
    qualityPerformanceImpactsPayment: qualityPerformanceImpactsPaymentConfig
  } = usePlanTranslation('opsEvalAndLearning');

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<GetCCWAndQualityFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useGetCcwAndQualityQuery({
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
    qualityPerformanceImpactsPaymentOther,
    qualityPerformanceImpactsPaymentNote
  } = (data?.modelPlan?.opsEvalAndLearning || {}) as GetCCWAndQualityFormType;

  const modelName = data?.modelPlan?.modelName || '';

  // If redirected from Operational Solutions, scrolls to the relevant question
  useScrollElement(!loading);

  const { mutationError } = useHandleMutation(
    TypedUpdatePlanOpsEvalAndLearningDocument,
    {
      id,
      formikRef
    }
  );

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
    qualityPerformanceImpactsPaymentOther:
      qualityPerformanceImpactsPaymentOther ?? '',
    qualityPerformanceImpactsPaymentNote:
      qualityPerformanceImpactsPaymentNote ?? ''
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
          history.push(
            `/models/${modelID}/collaboration-area/task-list/ops-eval-and-learning/data-sharing`
          );
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<GetCCWAndQualityFormType>) => {
          const { handleSubmit, setErrors, values, setFieldValue } =
            formikProps;

          return (
            <>
              <ConfirmLeave />

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
                      <h3>{opsEvalAndLearningMiscT('ccwSpecific')}</h3>

                      <FieldGroup>
                        <Label
                          htmlFor="ops-eval-and-learning-send-files"
                          className="maxw-none"
                        >
                          {opsEvalAndLearningT('sendFilesBetweenCcw.label')}
                        </Label>

                        <BooleanRadio
                          field="sendFilesBetweenCcw"
                          id="ops-eval-and-learning-send-files"
                          value={values.sendFilesBetweenCcw}
                          setFieldValue={setFieldValue}
                          options={sendFilesBetweenCcwConfig.options}
                        />

                        <AddNote
                          id="ops-eval-and-learning-send-files-note"
                          field="sendFilesBetweenCcwNote"
                        />
                      </FieldGroup>

                      <FieldGroup>
                        <Label
                          htmlFor="ops-eval-and-learning-app-to-send-files"
                          className="maxw-none"
                        >
                          {opsEvalAndLearningT('appToSendFilesToKnown.label')}
                        </Label>

                        <BooleanRadio
                          field="appToSendFilesToKnown"
                          id="ops-eval-and-learning-app-to-send-files"
                          value={values.appToSendFilesToKnown}
                          setFieldValue={setFieldValue}
                          options={appToSendFilesToKnownConfig.options}
                          childName="appToSendFilesToWhich"
                        >
                          {values.appToSendFilesToKnown === true ? (
                            <div className="margin-left-4 margin-top-1">
                              <Label
                                htmlFor="ops-eval-and-learning-app-to-send-files-which"
                                className="text-normal"
                              >
                                {opsEvalAndLearningT(
                                  'appToSendFilesToWhich.label'
                                )}
                              </Label>

                              <Field
                                as={TextAreaField}
                                className="maxw-none mint-textarea"
                                id="ops-eval-and-learning-app-to-send-files-which"
                                maxLength={5000}
                                name="appToSendFilesToWhich"
                              />
                            </div>
                          ) : (
                            <></>
                          )}
                        </BooleanRadio>

                        <AddNote
                          id="ops-eval-and-learning-app-to-distribute-files-note"
                          field="appToSendFilesToNote"
                        />
                      </FieldGroup>

                      <FieldGroup>
                        <Label
                          htmlFor="ops-eval-and-learning-distribute-files"
                          className="maxw-none"
                        >
                          {opsEvalAndLearningT(
                            'useCcwForFileDistribiutionToParticipants.label'
                          )}
                        </Label>

                        <BooleanRadio
                          field="useCcwForFileDistribiutionToParticipants"
                          id="ops-eval-and-learning-distribute-files"
                          value={
                            values.useCcwForFileDistribiutionToParticipants
                          }
                          setFieldValue={setFieldValue}
                          options={
                            useCcwForFileDistribiutionToParticipantsConfig.options
                          }
                        />

                        <AddNote
                          id="ops-eval-and-learning-distribute-files-note"
                          field="useCcwForFileDistribiutionToParticipantsNote"
                        />
                      </FieldGroup>
                    </>
                  )}

                  {isQualityMeasures(dataNeededForMonitoring) && (
                    <>
                      <h3>{opsEvalAndLearningMiscT('qualityQuestions')}</h3>

                      <FieldGroup scrollElement="developNewQualityMeasures">
                        <Label
                          htmlFor="ops-eval-and-learning-develop-measures"
                          className="maxw-none"
                        >
                          {opsEvalAndLearningT(
                            'developNewQualityMeasures.label'
                          )}
                        </Label>

                        <MTOWarning id="ops-eval-and-learning-data-needed-warning" />

                        <BooleanRadio
                          field="developNewQualityMeasures"
                          id="ops-eval-and-learning-develop-measures"
                          value={values.developNewQualityMeasures}
                          setFieldValue={setFieldValue}
                          options={developNewQualityMeasuresConfig.options}
                        />

                        <AddNote
                          id="ops-eval-and-learning-develop-measures-note"
                          field="developNewQualityMeasuresNote"
                        />
                      </FieldGroup>

                      <FieldGroup>
                        <Label
                          htmlFor="ops-eval-and-learning-performance-impact"
                          className="maxw-none"
                        >
                          {opsEvalAndLearningT(
                            'qualityPerformanceImpactsPayment.label'
                          )}
                        </Label>

                        <Fieldset>
                          {getKeys(
                            qualityPerformanceImpactsPaymentConfig.options
                          ).map(key => (
                            <Fragment key={key}>
                              <Field
                                as={Radio}
                                id={`ops-eval-and-learning-performance-impact-${key}`}
                                data-testid={`ops-eval-and-learning-performance-impact-${key}`}
                                name="qualityPerformanceImpactsPayment"
                                label={
                                  qualityPerformanceImpactsPaymentConfig
                                    .options[key]
                                }
                                value={key}
                                checked={
                                  values.qualityPerformanceImpactsPayment ===
                                  key
                                }
                                onChange={() => {
                                  setFieldValue(
                                    'qualityPerformanceImpactsPayment',
                                    key
                                  );
                                }}
                              />

                              {key === YesNoOtherType.OTHER &&
                                values.qualityPerformanceImpactsPayment ===
                                  YesNoOtherType.OTHER && (
                                  <div className="margin-left-4 margin-top-1">
                                    <Field
                                      as={TextInput}
                                      id="ops-eval-and-learning-performance-impact-other"
                                      data-testid="ops-eval-and-learning-performance-impact-other"
                                      disabled={
                                        values.qualityPerformanceImpactsPayment !==
                                        YesNoOtherType.OTHER
                                      }
                                      name="qualityPerformanceImpactsPaymentOther"
                                    />
                                  </div>
                                )}
                            </Fragment>
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
                        history.push(
                          `/models/${modelID}/collaboration-area/task-list/ops-eval-and-learning/evaluation`
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
                      history.push(
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
              </Form>
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
