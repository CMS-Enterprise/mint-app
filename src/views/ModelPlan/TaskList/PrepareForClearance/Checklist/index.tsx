/*
Checklist view and form for Prepare for Clearance task list section
Each checkbox modifies the 'status' on its respective task list sections
*/

import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Fieldset,
  Grid,
  Icon
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  GetClearanceStatusesQuery,
  PrepareForClearanceStatus,
  TaskStatus,
  TaskStatusInput,
  UpdateClearanceBasicsMutationFn,
  UpdateClearanceBeneficiariesMutationFn,
  UpdateClearanceCharacteristicsMutationFn,
  UpdateClearanceOpsEvalAndLearningMutationFn,
  UpdateClearanceParticipantsAndProvidersMutationFn,
  UpdateClearancePaymentsMutationFn,
  useGetClearanceStatusesQuery,
  useUpdateClearanceBasicsMutation,
  useUpdateClearanceBeneficiariesMutation,
  useUpdateClearanceCharacteristicsMutation,
  useUpdateClearanceOpsEvalAndLearningMutation,
  useUpdateClearanceParticipantsAndProvidersMutation,
  useUpdateClearancePaymentsMutation,
  useUpdatePrepareForClearanceMutation
} from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import { formatDateUtc } from 'utils/date';
import flattenErrors from 'utils/flattenErrors';
import dirtyInput from 'utils/formDiff';
import { NotFoundPartial } from 'views/NotFound';

// Initial form values and types for each task-list clearance checkbox
interface ClearanceFormValues {
  id: string;
  readyForClearanceByUserAccount?: { commonName: string } | null;
  readyForClearanceDts?: string | null;
  status: TaskStatus;
}

const initialClearanceFormValues = {
  id: '',
  readyForClearanceByUserAccount: {
    id: '',
    commonName: ''
  },
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

type MutationObjectType = {
  basics: UpdateClearanceBasicsMutationFn;
  generalCharacteristics: UpdateClearanceCharacteristicsMutationFn;
  participantsAndProviders: UpdateClearanceParticipantsAndProvidersMutationFn;
  beneficiaries: UpdateClearanceBeneficiariesMutationFn;
  opsEvalAndLearning: UpdateClearanceOpsEvalAndLearningMutationFn;
  payments: UpdateClearancePaymentsMutationFn;
};

// Function to convert any statuses that are READY, as it's not allowed in mutation
const convertReadyStatus = (status: TaskStatus): TaskStatusInput => {
  switch (status) {
    case TaskStatus.IN_PROGRESS:
      return TaskStatusInput.IN_PROGRESS;
    case TaskStatus.READY_FOR_CLEARANCE:
      return TaskStatusInput.READY_FOR_CLEARANCE;
    case TaskStatus.READY_FOR_REVIEW:
      return TaskStatusInput.READY_FOR_REVIEW;
    // Handle other cases by converting
    case TaskStatus.READY:
    default:
      return TaskStatusInput.IN_PROGRESS;
  }
};

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

  const { data, loading, error } = useGetClearanceStatusesQuery({
    variables: {
      id: modelID
    }
  });

  const modelPlan = data?.modelPlan || initialPrepareForClearanceValues;

  // const [updatePrepareForClearance] = useUpdatePrepareForClearanceMutation();

  const [updateBasics] = useUpdateClearanceBasicsMutation();

  const [updateCharacteristics] = useUpdateClearanceCharacteristicsMutation();

  const [
    updateParticipantsAndProviders
  ] = useUpdateClearanceParticipantsAndProvidersMutation();

  const [updateBeneficiaries] = useUpdateClearanceBeneficiariesMutation();

  const [
    updateOpsEvalAndLearning
  ] = useUpdateClearanceOpsEvalAndLearningMutation();

  const [updatePayments] = useUpdateClearancePaymentsMutation();

  // Object to dynamically call each task list mutation within handleFormSubmit
  const clearanceMutations: MutationObjectType = {
    basics: updateBasics,
    generalCharacteristics: updateCharacteristics,
    participantsAndProviders: updateParticipantsAndProviders,
    beneficiaries: updateBeneficiaries,
    opsEvalAndLearning: updateOpsEvalAndLearning,
    payments: updatePayments
  };

  const handleFormSubmit = async () => {
    const changes = dirtyInput(
      formikRef?.current?.initialValues,
      formikRef?.current?.values
    );

    await Promise.all(
      Object.keys(changes).map(section => {
        return clearanceMutations[section as keyof MutationObjectType]({
          variables: {
            id: changes[section].id,
            changes: {
              status: convertReadyStatus(changes[section].status)
            }
          }
        });
      })
    )
      .then(responses => {
        const errors = responses?.find(result => result?.errors);

        if (!errors) {
          history.push(`/models/${modelID}/task-list`);
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  if (
    (!loading && error) ||
    (!loading && !modelPlan) ||
    (data as GetClearanceStatusesQuery)?.modelPlan?.prepareForClearance
      ?.status === PrepareForClearanceStatus.CANNOT_START
  ) {
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
        onSubmit={() => {
          handleFormSubmit();
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

                <Fieldset disabled={!!error || loading}>
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

                        const readyForClearanceByUserAccount =
                          values[
                            section as keyof ClearanceStatusesModelPlanFormType
                          ]?.readyForClearanceByUserAccount;

                        const readyForClearanceDts =
                          values[
                            section as keyof ClearanceStatusesModelPlanFormType
                          ]?.readyForClearanceDts;

                        // Bypass/don't render itSolutions or prepareForClearance task list sections
                        if (
                          section === 'itSolutions' ||
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
                            {readyForClearanceByUserAccount &&
                              readyForClearanceDts && (
                                <SectionClearanceLabel
                                  commonName={
                                    readyForClearanceByUserAccount.commonName
                                  }
                                  readyForClearanceDts={readyForClearanceDts}
                                />
                              )}

                            <Grid tablet={{ col: 8 }}>
                              {/* Need to pass in section ID to update readyForClearance state on next route */}
                              <UswdsReactLink
                                data-testid={`clearance-${section}`}
                                to={`/models/${modelID}/task-list/prepare-for-clearance/${taskListSections[section].path}/${sectionID}`}
                                className="margin-left-4 margin-top-1 margin-bottom-2 display-flex flex-align-center"
                              >
                                {t('review', {
                                  section: taskListSections[
                                    section
                                  ].heading.toLowerCase()
                                })}

                                <Icon.ArrowForward
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
                      data-testid="update-clearance"
                      onClick={() => setErrors({})}
                    >
                      {t('update')}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    data-testid="dont-update-clearance"
                    className="usa-button usa-button--unstyled display-flex"
                    onClick={() => history.push(`/models/${modelID}/task-list`)}
                  >
                    <Icon.ArrowBack className="margin-right-1" aria-hidden />
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
  commonName: string;
  readyForClearanceDts: string;
};

// Label to render who marked readyForClearance and when
export const SectionClearanceLabel = ({
  className,
  commonName,
  readyForClearanceDts
}: SectionClearanceLabelProps): JSX.Element => {
  const { t } = useTranslation('prepareForClearance');

  return (
    <p
      data-testid="clearance-label"
      className={classNames(className, 'margin-left-4 text-base margin-y-0')}
    >
      {t('markedAsReady', {
        name: commonName,
        date: formatDateUtc(readyForClearanceDts, 'MM/dd/yyyy')
      })}
    </p>
  );
};

export default PrepareForClearanceCheckList;
