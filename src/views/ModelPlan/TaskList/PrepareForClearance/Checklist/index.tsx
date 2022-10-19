import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Fieldset,
  Grid,
  IconArrowBack,
  IconArrowForward
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { Field, Form, Formik, FormikProps } from 'formik';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import AutoSave from 'components/shared/AutoSave';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
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
import { formatDate } from 'utils/date';
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

type GetClearanceStatusesModelPlanFormType = Omit<
  GetClearanceStatusesModelPlanType,
  'id' | '__typename'
>;

const initialPrepareForClearanceValues: GetClearanceStatusesModelPlanFormType = {
  basics: initialBasicsValues,
  generalCharacteristics: initialCharacteristicsValues,
  participantsAndProviders: initialParticipantsAndProvidersValues,
  beneficiaries: initialBeneficiariesValues,
  opsEvalAndLearning: initialOpsEvalAndLearningValues,
  payments: initialPaymentValues
};

const convertReadyStatus = (status: TaskStatus): TaskStatus =>
  status === TaskStatus.READY ? TaskStatus.IN_PROGRESS : status;

type PrepareForClearanceCheckListProps = {
  modelID: string;
};

const PrepareForClearanceCheckList = ({
  modelID
}: PrepareForClearanceCheckListProps) => {
  const { t } = useTranslation('prepareForClearance');
  const { t: h } = useTranslation('draftModelPlan');

  const taskListSections: any = t('modelPlanTaskList:numberedList', {
    returnObjects: true
  });

  const formikRef = useRef<FormikProps<GetClearanceStatusesModelPlanFormType>>(
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
    formikValues: GetClearanceStatusesModelPlanFormType
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
          history.push(`/models/${modelID}/task-list`);
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
    <Grid desktop={{ col: 6 }}>
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
        {t('description')}
      </p>

      <Formik
        initialValues={modelPlan}
        onSubmit={values => {
          handleFormSubmit(values);
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<GetClearanceStatusesModelPlanFormType>) => {
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
                className="margin-y-6"
                data-testid="prepare-for-clearance-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <h3 className="margin-bottom-0">{t('subheading')}</h3>

                <Fieldset disabled={loading}>
                  <div className="margin-top-3 margin-bottom-3">
                    <FieldGroup
                      scrollElement="basics"
                      error={!!flatErrors.basics}
                      className="margin-top-4"
                    >
                      <FieldErrorMsg>{flatErrors.basics}</FieldErrorMsg>
                      {Object.keys(taskListSections).map((section: string) => {
                        if (
                          section === 'itTools' ||
                          section === 'prepareForClearance'
                        )
                          return null;
                        return (
                          <Fragment key={section}>
                            <Field
                              as={CheckboxField}
                              id={`prepare-for-clearance-${section}`}
                              testid={`prepare-for-clearance-${section}`}
                              name={`${section}.status`}
                              label={taskListSections[section].heading}
                              checked={
                                values[
                                  section as keyof GetClearanceStatusesModelPlanFormType
                                ]?.status === TaskStatus.READY_FOR_CLEARANCE
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

                            {/* Label to render who marked readyForClearance and when */}
                            {values[
                              section as keyof GetClearanceStatusesModelPlanFormType
                            ]?.readyForClearanceBy && (
                              <SectionClearanceLabel
                                readyForClearanceBy={
                                  values[
                                    section as keyof GetClearanceStatusesModelPlanFormType
                                  ]?.readyForClearanceBy!
                                }
                                readyForClearanceDts={
                                  values[
                                    section as keyof GetClearanceStatusesModelPlanFormType
                                  ]?.readyForClearanceDts!
                                }
                              />
                            )}

                            {/* Need to pass in Basics ID to update readyForClearance state on next route */}
                            <UswdsReactLink
                              to={`/models/${modelID}/task-list/prepare-for-clearance/${
                                taskListSections[section].path
                              }/${
                                values[
                                  section as keyof GetClearanceStatusesModelPlanFormType
                                ]?.id
                              }`}
                              className="margin-left-4 margin-top-1 margin-bottom-2 display-flex flex-align-center"
                            >
                              {t('review', {
                                section: taskListSections[
                                  section
                                ].heading.toLowerCase()
                              })}

                              <IconArrowForward
                                className="margin-right-1"
                                aria-hidden
                              />
                            </UswdsReactLink>
                          </Fragment>
                        );
                      })}
                    </FieldGroup>

                    <Button
                      className="margin-top-4"
                      type="submit"
                      onClick={() => setErrors({})}
                    >
                      {t('update')}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    className="usa-button usa-button--unstyled"
                    onClick={() => handleFormSubmit(values)}
                  >
                    <IconArrowBack className="margin-right-1" aria-hidden />
                    {t('dontUpdate')}
                  </Button>
                </Fieldset>
              </Form>

              {modelPlan && !loading && (
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
    </Grid>
  );
};

type SectionClearanceLabelProps = {
  className?: string;
  readyForClearanceBy: string;
  readyForClearanceDts: string;
};

// Label to render who marked readyForClearance and when
const SectionClearanceLabel = ({
  className,
  readyForClearanceBy,
  readyForClearanceDts
}: SectionClearanceLabelProps): JSX.Element => {
  const { t } = useTranslation('prepareForClearance');
  return (
    <p className={classNames(className, 'margin-left-4 text-base margin-y-0')}>
      {t('markedAsReady', {
        readyForClearanceBy,
        readyForClearanceDts: formatDate(readyForClearanceDts, 'MM/d/yyyy')
      })}
    </p>
  );
};

export default PrepareForClearanceCheckList;
