/*
Checklist view and form for Prepare for Clearance task list section
Each checkbox modifies the 'status' on its respective task list sections
*/

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
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import GetClearanceStatuses from 'queries/PrepareForClearance/GetClearanceStatuses';
import {
  GetClearanceStatuses as GetClearanceStatusesType,
  GetClearanceStatusesVariables
} from 'queries/PrepareForClearance/types/GetClearanceStatuses';
import { UpdatePrepareForClearanceVariables } from 'queries/PrepareForClearance/types/UpdatePrepareForClearance';
import UpdatePrepareForClearance from 'queries/PrepareForClearance/UpdatePrepareForClearance';
import { TaskStatus } from 'types/graphql-global-types';
import { formatDate } from 'utils/date';
import flattenErrors from 'utils/flattenErrors';
import { NotFoundPartial } from 'views/NotFound';

// Initial form values and types for each task-list clearance checkbox
interface ClearanceFormValues {
  id: string;
  readyForClearanceBy: string | null;
  readyForClearanceDts: string | null;
  status: TaskStatus;
}

const initialClearanceFormValues = {
  id: '',
  readyForClearanceBy: null,
  readyForClearanceDts: null,
  status: TaskStatus.READY
};

export type ClearanceStatusesModelPlanFormType = {
  basics: ClearanceFormValues;
  generalCharacteristics: ClearanceFormValues;
  participantsAndProviders: ClearanceFormValues;
  beneficiaries: ClearanceFormValues;
  opsEvalAndLearning: ClearanceFormValues;
  payments: ClearanceFormValues;
};

export const initialPrepareForClearanceValues: ClearanceStatusesModelPlanFormType = {
  basics: { ...initialClearanceFormValues },
  generalCharacteristics: { ...initialClearanceFormValues },
  participantsAndProviders: { ...initialClearanceFormValues },
  beneficiaries: { ...initialClearanceFormValues },
  opsEvalAndLearning: { ...initialClearanceFormValues },
  payments: { ...initialClearanceFormValues }
};

// Function to convert any statuses that are READY, as it's not allowed in mutation
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

  const history = useHistory();

  // Used to map, iterate and label task list sections and values from query
  const taskListSections: any = t('modelPlanTaskList:numberedList', {
    returnObjects: true
  });

  // User to set errors outside the script of the form component
  const formikRef = useRef<FormikProps<ClearanceStatusesModelPlanFormType>>(
    null
  );

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
    formikValues: ClearanceStatusesModelPlanFormType
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
        {(formikProps: FormikProps<ClearanceStatusesModelPlanFormType>) => {
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
                      {/* Mapping over task list sections and dynamically rendering each checkbox with labels */}
                      {Object.keys(taskListSections).map((section: string) => {
                        const sectionID =
                          values[
                            section as keyof ClearanceStatusesModelPlanFormType
                          ]?.id;

                        const sectionStatus =
                          values[
                            section as keyof ClearanceStatusesModelPlanFormType
                          ]?.status;

                        const readyForClearanceBy =
                          values[
                            section as keyof ClearanceStatusesModelPlanFormType
                          ]?.readyForClearanceBy;

                        const readyForClearanceDts =
                          values[
                            section as keyof ClearanceStatusesModelPlanFormType
                          ]?.readyForClearanceDts;

                        // Bypass/don't render itTools or prepareForClearance task list sections
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
                                sectionStatus === TaskStatus.READY_FOR_CLEARANCE
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
                                    TaskStatus.IN_PROGRESS
                                  );
                                }
                              }}
                            />

                            {/* Label to render who marked readyForClearance and when */}
                            {readyForClearanceBy && (
                              <SectionClearanceLabel
                                readyForClearanceBy={readyForClearanceBy!}
                                readyForClearanceDts={readyForClearanceDts!}
                              />
                            )}

                            <Grid tablet={{ col: 8 }}>
                              {/* Need to pass in section ID to update readyForClearance state on next route */}
                              <UswdsReactLink
                                to={`/models/${modelID}/task-list/prepare-for-clearance/${taskListSections[section].path}/${sectionID}`}
                                className="margin-left-4 margin-top-1 margin-bottom-2 display-flex flex-align-center"
                              >
                                {t('review', {
                                  section: taskListSections[
                                    section
                                  ].heading.toLowerCase()
                                })}

                                <IconArrowForward
                                  className="margin-left-1"
                                  aria-hidden
                                />
                              </UswdsReactLink>
                            </Grid>
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
                    className="usa-button usa-button--unstyled display-flex"
                    onClick={() => history.push(`/models/${modelID}/task-list`)}
                  >
                    <IconArrowBack className="margin-right-1" aria-hidden />
                    {t('dontUpdate')}
                  </Button>
                </Fieldset>
              </Form>
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
export const SectionClearanceLabel = ({
  className,
  readyForClearanceBy,
  readyForClearanceDts
}: SectionClearanceLabelProps): JSX.Element => {
  const { t } = useTranslation('prepareForClearance');
  return (
    <p
      data-testid="clearance-label"
      className={classNames(className, 'margin-left-4 text-base margin-y-0')}
    >
      {t('markedAsReady', {
        readyForClearanceBy,
        readyForClearanceDts: formatDate(readyForClearanceDts, 'MM/d/yyyy')
      })}
    </p>
  );
};

export default PrepareForClearanceCheckList;
