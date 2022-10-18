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
  Grid,
  IconArrowBack
  //   Label,
  //   TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import AskAQuestion from 'components/AskAQuestion';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
// import AutoSave from 'components/shared/AutoSave';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
// import FieldErrorMsg from 'components/shared/FieldErrorMsg';
// import FieldGroup from 'components/shared/FieldGroup';
import GetClearanceStatuses from 'queries/PrepareForClearance/GetClearanceStatuses';
import {
  GetClearanceStatuses as GetClearanceStatusesType,
  GetClearanceStatuses_modelPlan as GetClearanceStatusesModelPlanType,
  GetClearanceStatuses_modelPlan_basics as GetClearanceStatusesModelPlanBasicsType,
  GetClearanceStatuses_modelPlan_beneficiaries as GetClearanceStatusesModelPlanBeneficiaries,
  GetClearanceStatuses_modelPlan_generalCharacteristics as GetClearanceStatusesModelPlanGeneralCharacteristics,
  GetClearanceStatuses_modelPlan_opsEvalAndLearning as GetClearanceStatusesModelPlanOpsEvalAndLearning,
  GetClearanceStatuses_modelPlan_participantsAndProviders as GetClearanceStatusesModelPlanParticipantsAndProviders,
  GetClearanceStatuses_modelPlan_payments as GetClearanceStatusesModelPlanPayments,
  GetClearanceStatusesVariables
} from 'queries/PrepareForClearance/types/GetClearanceStatuses';
import { UpdatePrepareForClearanceVariables } from 'queries/PrepareForClearance/types/UpdatePrepareForClearance';
import UpdatePrepareForClearance from 'queries/PrepareForClearance/UpdatePrepareForClearance';
import { TaskStatus } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { NotFoundPartial } from 'views/NotFound';

const initialBasicsValues: GetClearanceStatusesModelPlanBasicsType = {
  __typename: 'PlanBasics',
  id: '',
  readyForClearanceBy: null,
  readyForClearanceDts: null,
  status: TaskStatus.READY
};

const initialCharacteristicsValues: GetClearanceStatusesModelPlanGeneralCharacteristics = {
  __typename: 'PlanGeneralCharacteristics',
  id: '',
  readyForClearanceBy: null,
  readyForClearanceDts: null,
  status: TaskStatus.READY
};

const initialParticipantsAndProvidersValues: GetClearanceStatusesModelPlanParticipantsAndProviders = {
  __typename: 'PlanParticipantsAndProviders',
  id: '',
  readyForClearanceBy: null,
  readyForClearanceDts: null,
  status: TaskStatus.READY
};

const initialBeneficiariesValues: GetClearanceStatusesModelPlanBeneficiaries = {
  __typename: 'PlanBeneficiaries',
  id: '',
  readyForClearanceBy: null,
  readyForClearanceDts: null,
  status: TaskStatus.READY
};

const initialOpsEvalAndLearningValues: GetClearanceStatusesModelPlanOpsEvalAndLearning = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '',
  readyForClearanceBy: null,
  readyForClearanceDts: null,
  status: TaskStatus.READY
};

const initialPaymentValues: GetClearanceStatusesModelPlanPayments = {
  __typename: 'PlanPayments',
  id: '',
  readyForClearanceBy: null,
  readyForClearanceDts: null,
  status: TaskStatus.READY
};

const initialPrepareForClearanceValues: GetClearanceStatusesModelPlanType = {
  __typename: 'ModelPlan',
  id: '',
  basics: initialBasicsValues,
  generalCharacteristics: initialCharacteristicsValues,
  participantsAndProviders: initialParticipantsAndProvidersValues,
  beneficiaries: initialBeneficiariesValues,
  opsEvalAndLearning: initialOpsEvalAndLearningValues,
  payments: initialPaymentValues
};

const convertReadyStatus = (status: TaskStatus): TaskStatus =>
  status === TaskStatus.READY ? TaskStatus.IN_PROGRESS : status;

const PrepareForClearanceCheckList = () => {
  const { t } = useTranslation('prepareForClearnace');
  const { t: h } = useTranslation('draftModelPlan');

  const taskListSections: any = t('modelPlanTaskList:numberedList', {
    returnObjects: true
  });

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<GetClearanceStatusesModelPlanType>>(
    null
  );
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetClearanceStatusesType,
    GetClearanceStatusesVariables
  >(GetClearanceStatuses, {
    variables: {
      id: modelID
    }
  });

  const modelPlan = data?.modelPlan || initialPrepareForClearanceValues;

  const [
    updatePrepareForClearance
  ] = useMutation<UpdatePrepareForClearanceVariables>(
    UpdatePrepareForClearance
  );

  const handleFormSubmit = (
    formikValues: GetClearanceStatusesModelPlanType,
    redirect?: 'next' | 'back' | 'task-list'
  ) => {
    const {
      basics,
      generalCharacteristics,
      participantsAndProviders,
      beneficiaries,
      opsEvalAndLearning,
      payments
    } = formikValues;
    updatePrepareForClearance({
      variables: {
        basicsID: basics.id,
        basicsChanges: { status: convertReadyStatus(basics.status) },
        characteristicsID: generalCharacteristics.id,
        characteristicsChanges: {
          status: convertReadyStatus(generalCharacteristics.status)
        },
        participantsAndProvidersID: participantsAndProviders.id,
        participantsAndProvidersChanges: {
          status: convertReadyStatus(participantsAndProviders.status)
        },
        beneficiariesID: beneficiaries.id,
        benficiariesChanges: {
          status: convertReadyStatus(beneficiaries.status)
        },
        opsEvalAndLearningID: opsEvalAndLearning.id,
        opsEvalAndLearningChanges: {
          status: convertReadyStatus(opsEvalAndLearning.status)
        },
        paymentsID: payments.id,
        paymentsChanges: { status: convertReadyStatus(payments.status) }
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (redirect === 'next') {
            history.push(`/models/${modelID}/task-list/prepare-for-clearance`);
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
      />
      <p className="margin-bottom-2 font-body-md line-height-sans-4">
        {t('subheading')}
      </p>

      <AskAQuestion modelID={modelID} />

      <Formik
        initialValues={modelPlan}
        onSubmit={values => {
          handleFormSubmit(values, 'next');
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<GetClearanceStatusesModelPlanType>) => {
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

              <Grid row gap>
                <Grid desktop={{ col: 6 }}>
                  <Form
                    className="margin-top-6"
                    data-testid="it-tools-page-one-form"
                    onSubmit={e => {
                      handleSubmit(e);
                    }}
                  >
                    <h2>{t('heading')}</h2>

                    <Fieldset disabled={loading}>
                      <div className="margin-top-6 margin-bottom-3">
                        {Object.keys(taskListSections).map((section: any) => {
                          return (
                            <Fragment key={section}>
                              <Field
                                as={CheckboxField}
                                id={`prepare-for-clearance-${section}`}
                                testid={`prepare-for-clearance-${section}`}
                                name={`${section}.status`}
                                label={taskListSections[section].heading}
                                checked={
                                  values[section]?.status ===
                                  TaskStatus.READY_FOR_CLEARANCE
                                }
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  if (e.target.checked) {
                                    setFieldValue(
                                      `${section}.status`,
                                      TaskStatus.READY_FOR_CLEARANCE
                                    );
                                  } else {
                                    setFieldValue(
                                      `${section}.status`,
                                      TaskStatus.READY_FOR_REVIEW
                                    );
                                  }
                                }}
                              />
                            </Fragment>
                          );
                        })}

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

              {/* {modelPlan.id && !loading && (
                <AutoSave
                  values={values}
                  onSave={() => {
                    handleFormSubmit(formikRef.current!.values);
                  }}
                  debounceDelay={3000}
                />
              )} */}
            </>
          );
        }}
      </Formik>
      <PageNumber currentPage={1} totalPages={9} className="margin-y-6" />
    </>
  );
};

export default PrepareForClearanceCheckList;
