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
import GetITToolsPageSeven from 'queries/ITTools/GetITToolsPageSeven';
import {
  GetITToolPageSeven as GetITToolPageSevenType,
  GetITToolPageSeven_modelPlan as ModelPlanType,
  GetITToolPageSeven_modelPlan_itTools as ITToolsPageSevenFormType,
  GetITToolPageSeven_modelPlan_opsEvalAndLearning as OpsEvalAndLearningType,
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
  translateDataToSendParticipantsType,
  translateModelLearningSystemType,
  translateOelLearningContractorType,
  translateOelParticipantCollaborationType,
  translateOelSendReportsType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import { ITToolsFormComponent } from '..';

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

const initialOpsEvalAndLearningValues: OpsEvalAndLearningType = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '',
  dataToSendParticicipants: [],
  modelLearningSystems: []
};

const initialModelPlanValues: ModelPlanType = {
  __typename: 'ModelPlan',
  id: '',
  modelName: '',
  opsEvalAndLearning: initialOpsEvalAndLearningValues,
  itTools: initialFormValues
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

  const modelPlan = data?.modelPlan || initialModelPlanValues;

  const {
    modelName,
    itTools,
    opsEvalAndLearning: { dataToSendParticicipants, modelLearningSystems }
  } = modelPlan;

  /**
   * Identifying if each question requires tooling as well as rending answers
   * Checkbox answers will not be checked despite a store truthy boolean
   * 'Specify other' answer will not be rendered even if OTHER value is true
   */
  const questionOneNeedsTools: boolean =
    dataToSendParticicipants.length > 0 &&
    !dataToSendParticicipants.includes(
      DataToSendParticipantsType.NOT_PLANNING_TO_SEND_DATA
    );

  const questionTwoNeedsTools: boolean = modelLearningSystems.includes(
    ModelLearningSystemType.LEARNING_CONTRACTOR
  );

  const questionThreeNeedsTools: boolean = modelLearningSystems.includes(
    ModelLearningSystemType.PARTICIPANT_COLLABORATION
  );

  const [update] = useMutation<UpdatePlanItToolsVariables>(UpdatePlanITTools);

  const handleFormSubmit = (
    formikValues: ITToolsPageSevenFormType,
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
                    <Fieldset disabled={loading}>
                      {/* Question One: What data will you send to participants? */}
                      <FieldGroup
                        scrollElement="oelSendReports"
                        error={!!flatErrors.oelSendReports}
                        className="margin-y-4"
                      >
                        <legend className="usa-label maxw-none">
                          {t('sendReportTools')}
                        </legend>

                        <FieldErrorMsg>
                          {flatErrors.oelSendReports}
                        </FieldErrorMsg>

                        <ITToolsSummary
                          question={o('dataToSend')}
                          answers={dataToSendParticicipants.map(dataToSend =>
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
                          needsTool={questionOneNeedsTools}
                          subtext={t('sendDataNeedsAnswer')}
                          scrollElememnt="dataToSendParticicipants"
                        />

                        <ITToolsFormComponent
                          flatErrors={flatErrors}
                          formikValue={values.oelSendReports}
                          fieldName="oelSendReports"
                          needsTool={questionOneNeedsTools}
                          htmlID="oel-send-reports"
                          EnumType={OelSendReportsType}
                          translation={translateOelSendReportsType}
                        />
                      </FieldGroup>

                      {/* Question Two: Will the model have a learning system? */}

                      <FieldGroup
                        scrollElement="oelLearningContractor"
                        error={!!flatErrors.oelLearningContractor}
                        className="margin-y-4"
                      >
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
                          needsTool={questionTwoNeedsTools}
                          subtext={t('learningNeedsAnswer')}
                          scrollElememnt="modelLearningSystems"
                        />

                        <ITToolsFormComponent
                          flatErrors={flatErrors}
                          formikValue={values.oelLearningContractor}
                          fieldName="oelLearningContractor"
                          needsTool={questionTwoNeedsTools}
                          htmlID="oel-learning-contractor"
                          EnumType={OelLearningContractorType}
                          translation={translateOelLearningContractorType}
                        />
                      </FieldGroup>

                      {/* Question Three: Will the model have a learning system? */}

                      <FieldGroup
                        scrollElement="oelParticipantCollaboration"
                        error={!!flatErrors.oelParticipantCollaboration}
                        className="margin-y-4"
                      >
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
                          needsTool={questionThreeNeedsTools}
                          subtext={t('participantNeedsAnswer')}
                          scrollElememnt="modelLearningSystems"
                        />

                        <ITToolsFormComponent
                          flatErrors={flatErrors}
                          formikValue={values.oelParticipantCollaboration}
                          fieldName="oelParticipantCollaboration"
                          needsTool={questionThreeNeedsTools}
                          htmlID="oel-participant-collaboration"
                          EnumType={OelParticipantCollaborationType}
                          translation={translateOelParticipantCollaborationType}
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
      <PageNumber currentPage={7} totalPages={9} className="margin-y-6" />
    </>
  );
};

export default ITToolsPageSeven;
