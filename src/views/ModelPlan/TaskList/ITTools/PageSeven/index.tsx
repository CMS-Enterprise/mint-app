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
import GetITToolsPageSeven from 'queries/ITTools/GetITToolsPageSeven';
import {
  GetITToolPageSeven as GetITToolPageSevenType,
  GetITToolPageSeven_modelPlan_itTools as ITToolsPageSevenFormType,
  GetITToolPageSeven_modelPlan_opsEvalAndLearning as OpsEvalAndLearningFormType,
  GetITToolPageSevenVariables
} from 'queries/ITTools/types/GetITToolPageSeven';
import { UpdatePlanItToolsVariables } from 'queries/ITTools/types/UpdatePlanItTools';
import UpdatePlanITTools from 'queries/ITTools/UpdatePlanItTools';
import {
  DataToSendParticipantsType,
  ModelLearningSystemType,
  OelLearningContractorType,
  OelParticipantCollaborationType,
  OelSendReportsType
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import {
  sortOtherEnum,
  translateDataToSendParticipantsType,
  translateModelLearningSystemType,
  translateOelLearningContractorType,
  translateOelParticipantCollaborationType,
  translateOelSendReportsType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

const initialFormValues: ITToolsPageSevenFormType = {
  __typename: 'PlanITTools',
  id: '',
  oelSendReports: [],
  oelSendReportsOther: '',
  oelSendReportsNote: '',
  oelLearningContractor: [],
  oelLearningContractorOther: '',
  oelLearningContractorNote: '',
  oelParticipantCollaboration: [],
  oelParticipantCollaborationOther: '',
  oelParticipantCollaborationNote: ''
};

const initialOpsEvalAndLearningValues: OpsEvalAndLearningFormType = {
  __typename: 'PlanOpsEvalAndLearning',
  dataToSendParticicipants: [],
  modelLearningSystems: []
};

const ITToolsPageSeven = () => {
  const { t } = useTranslation('itTools');
  const { t: o } = useTranslation('operationsEvaluationAndLearning');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<ITToolsPageSevenFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetITToolPageSevenType,
    GetITToolPageSevenVariables
  >(GetITToolsPageSeven, {
    variables: {
      id: modelID
    }
  });

  const modelName = data?.modelPlan?.modelName || '';

  const id = data?.modelPlan?.itTools?.id || '';

  const itToolsData = data?.modelPlan?.itTools || initialFormValues;

  const { dataToSendParticicipants, modelLearningSystems } =
    data?.modelPlan?.opsEvalAndLearning || initialOpsEvalAndLearningValues;

  const [update] = useMutation<UpdatePlanItToolsVariables>(UpdatePlanITTools);

  const handleFormSubmit = (
    formikValues: ITToolsPageSevenFormType,
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
            history.push(`/models/${modelID}/task-list/it-tools/page-eight`);
          } else if (redirect === 'back') {
            history.push(`/models/${modelID}/task-list/it-tools/page-six`);
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
        {(formikProps: FormikProps<ITToolsPageSevenFormType>) => {
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
                    data-testid="oit-tools-page-seven-form"
                    onSubmit={e => {
                      handleSubmit(e);
                    }}
                  >
                    <FieldGroup
                      scrollElement="oelSendReports"
                      error={!!flatErrors.oelSendReports}
                      className="margin-y-4"
                    >
                      <FieldArray
                        name="oelSendReports"
                        render={arrayHelpers => (
                          <>
                            <legend className="usa-label maxw-none">
                              {t('sendReportTools')}
                            </legend>

                            <FieldErrorMsg>
                              {flatErrors.oelSendReports}
                            </FieldErrorMsg>

                            <ITToolsSummary
                              question={o('dataToSend')}
                              answers={dataToSendParticicipants.map(
                                dataToSend =>
                                  translateDataToSendParticipantsType(
                                    dataToSend || ''
                                  )
                              )}
                              options={Object.keys(DataToSendParticipantsType)
                                .map(dataType =>
                                  translateDataToSendParticipantsType(dataType)
                                )
                                .filter(
                                  dataType =>
                                    dataType !==
                                    DataToSendParticipantsType.NOT_PLANNING_TO_SEND_DATA
                                )}
                              redirect={`/models/${modelID}/task-list/ops-eval-and-learning/evaluation`}
                              answered={dataToSendParticicipants.length > 0}
                              needsTool={
                                dataToSendParticicipants.length > 0 &&
                                !dataToSendParticicipants.includes(
                                  DataToSendParticipantsType.NOT_PLANNING_TO_SEND_DATA
                                )
                              }
                              subtext={t('sendDataNeedsAnswer')}
                            />

                            <p className="margin-top-4">{t('tools')}</p>

                            {Object.keys(OelSendReportsType)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      disabled={
                                        dataToSendParticicipants.includes(
                                          DataToSendParticipantsType.NOT_PLANNING_TO_SEND_DATA
                                        ) ||
                                        dataToSendParticicipants.length === 0
                                      }
                                      id={`it-tools-oel-send-reports-${type}`}
                                      name="oelSendReports"
                                      label={translateOelSendReportsType(type)}
                                      value={type}
                                      checked={values?.oelSendReports.includes(
                                        type as OelSendReportsType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.oelSendReports.indexOf(
                                            e.target.value as OelSendReportsType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type === OelSendReportsType.OTHER &&
                                      values.oelSendReports.includes(type) && (
                                        <div className="margin-left-4 margin-top-1">
                                          <Label
                                            htmlFor="it-tools-oel-send-reports-other"
                                            className={classNames(
                                              {
                                                'text-gray-30':
                                                  dataToSendParticicipants.includes(
                                                    DataToSendParticipantsType.NOT_PLANNING_TO_SEND_DATA
                                                  ) ||
                                                  dataToSendParticicipants.length ===
                                                    0
                                              },
                                              'text-normal'
                                            )}
                                          >
                                            {h('pleaseSpecify')}
                                          </Label>
                                          <FieldErrorMsg>
                                            {flatErrors.oelSendReportsOther}
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            type="text"
                                            disabled={
                                              dataToSendParticicipants.includes(
                                                DataToSendParticipantsType.NOT_PLANNING_TO_SEND_DATA
                                              ) ||
                                              dataToSendParticicipants.length ===
                                                0
                                            }
                                            className="maxw-none"
                                            id="it-tools-oel-send-reports-other"
                                            maxLength={50}
                                            name="oelSendReportsOther"
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                );
                              })}
                            <AddNote
                              id="it-tools-oel-send-reports-note"
                              field="oelSendReportsNote"
                            />
                          </>
                        )}
                      />
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="oelLearningContractor"
                      error={!!flatErrors.oelLearningContractor}
                      className="margin-y-4"
                    >
                      <FieldArray
                        name="oelLearningContractor"
                        render={arrayHelpers => (
                          <>
                            <legend className="usa-label maxw-none">
                              {t('sendReportTools')}
                            </legend>

                            <FieldErrorMsg>
                              {flatErrors.oelLearningContractor}
                            </FieldErrorMsg>

                            <ITToolsSummary
                              question={o('dataToSend')}
                              answers={modelLearningSystems.map(system =>
                                translateModelLearningSystemType(system || '')
                              )}
                              redirect={`/models/${modelID}/task-list/ops-eval-and-learning/learning`}
                              answered={modelLearningSystems.length > 0}
                              needsTool={modelLearningSystems.includes(
                                ModelLearningSystemType.LEARNING_CONTRACTOR
                              )}
                              subtext={t('learningNeedsAnswer')}
                            />

                            <p className="margin-top-4">{t('tools')}</p>

                            {Object.keys(OelLearningContractorType)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      disabled={
                                        !modelLearningSystems.includes(
                                          ModelLearningSystemType.LEARNING_CONTRACTOR
                                        ) || modelLearningSystems.length === 0
                                      }
                                      id={`it-tools-oel-learning-contractor-${type}`}
                                      name="oelLearningContractor"
                                      label={translateOelLearningContractorType(
                                        type
                                      )}
                                      value={type}
                                      checked={values?.oelLearningContractor.includes(
                                        type as OelLearningContractorType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.oelLearningContractor.indexOf(
                                            e.target
                                              .value as OelLearningContractorType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type === OelLearningContractorType.OTHER &&
                                      values.oelLearningContractor.includes(
                                        type
                                      ) && (
                                        <div className="margin-left-4 margin-top-1">
                                          <Label
                                            htmlFor="it-tools-oel-learning-contractor-other"
                                            className={classNames(
                                              {
                                                'text-gray-30':
                                                  !modelLearningSystems.includes(
                                                    ModelLearningSystemType.LEARNING_CONTRACTOR
                                                  ) ||
                                                  modelLearningSystems.length ===
                                                    0
                                              },
                                              'text-normal'
                                            )}
                                          >
                                            {h('pleaseSpecify')}
                                          </Label>
                                          <FieldErrorMsg>
                                            {
                                              flatErrors.oelLearningContractorOther
                                            }
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            type="text"
                                            disabled={
                                              !modelLearningSystems.includes(
                                                ModelLearningSystemType.LEARNING_CONTRACTOR
                                              ) ||
                                              modelLearningSystems.length === 0
                                            }
                                            className="maxw-none"
                                            id="it-tools-oel-learning-contractor-other"
                                            maxLength={50}
                                            name="oelLearningContractorOther"
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                );
                              })}
                            <AddNote
                              id="it-tools-oel-learning-contractor-note"
                              field="oelLearningContractorNote"
                            />
                          </>
                        )}
                      />
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="oelParticipantCollaboration"
                      error={!!flatErrors.oelParticipantCollaboration}
                      className="margin-y-4"
                    >
                      <FieldArray
                        name="oelParticipantCollaboration"
                        render={arrayHelpers => (
                          <>
                            <legend className="usa-label maxw-none">
                              {t('sendReportTools')}
                            </legend>

                            <FieldErrorMsg>
                              {flatErrors.oelParticipantCollaboration}
                            </FieldErrorMsg>

                            <ITToolsSummary
                              question={o('dataToSend')}
                              answers={modelLearningSystems.map(system =>
                                translateModelLearningSystemType(system || '')
                              )}
                              redirect={`/models/${modelID}/task-list/ops-eval-and-learning/learning`}
                              answered={modelLearningSystems.length > 0}
                              needsTool={modelLearningSystems.includes(
                                ModelLearningSystemType.PARTICIPANT_COLLABORATION
                              )}
                              subtext={t('participantNeedsAnswer')}
                            />

                            <p className="margin-top-4">{t('tools')}</p>

                            {Object.keys(OelParticipantCollaborationType)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      disabled={
                                        !modelLearningSystems.includes(
                                          ModelLearningSystemType.PARTICIPANT_COLLABORATION
                                        ) || modelLearningSystems.length === 0
                                      }
                                      id={`it-tools-oel-participant-collaboration-${type}`}
                                      name="oelParticipantCollaboration"
                                      label={translateOelParticipantCollaborationType(
                                        type
                                      )}
                                      value={type}
                                      checked={values?.oelParticipantCollaboration.includes(
                                        type as OelParticipantCollaborationType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.oelParticipantCollaboration.indexOf(
                                            e.target
                                              .value as OelParticipantCollaborationType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type ===
                                      OelParticipantCollaborationType.OTHER &&
                                      values.oelParticipantCollaboration.includes(
                                        type
                                      ) && (
                                        <div className="margin-left-4 margin-top-1">
                                          <Label
                                            htmlFor="it-tools-oel-participant-collaboration-other"
                                            className={classNames(
                                              {
                                                'text-gray-30':
                                                  !modelLearningSystems.includes(
                                                    ModelLearningSystemType.PARTICIPANT_COLLABORATION
                                                  ) ||
                                                  modelLearningSystems.length ===
                                                    0
                                              },
                                              'text-normal'
                                            )}
                                          >
                                            {h('pleaseSpecify')}
                                          </Label>
                                          <FieldErrorMsg>
                                            {
                                              flatErrors.oelParticipantCollaborationOther
                                            }
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            type="text"
                                            disabled={
                                              !modelLearningSystems.includes(
                                                ModelLearningSystemType.PARTICIPANT_COLLABORATION
                                              ) ||
                                              modelLearningSystems.length === 0
                                            }
                                            className="maxw-none"
                                            id="it-tools-oel-participant-collaboration-other"
                                            maxLength={50}
                                            name="oelParticipantCollaborationOther"
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                );
                              })}
                            <AddNote
                              id="it-tools-oel-participant-collaboration-note"
                              field="oelParticipantCollaborationNote"
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
      <PageNumber currentPage={7} totalPages={9} className="margin-y-6" />
    </>
  );
};

export default ITToolsPageSeven;
