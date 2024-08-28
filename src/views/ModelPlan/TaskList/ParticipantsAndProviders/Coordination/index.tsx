import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Icon,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  GainshareArrangementEligibility,
  GetCoordinationQuery,
  ParticipantRequireFinancialGuaranteeType,
  ParticipantsIdType,
  TypedUpdatePlanParticipantsAndProvidersDocument,
  useGetCoordinationQuery
} from 'gql/gen/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import ITSolutionsWarning from 'components/ITSolutionsWarning';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import Tooltip from 'components/shared/Tooltip';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import useScrollElement from 'hooks/useScrollElement';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { NotFoundPartial } from 'views/NotFound';

type CoordinationFormType = GetCoordinationQuery['modelPlan']['participantsAndProviders'];

export const Coordination = () => {
  const { t: participantsAndProvidersT } = useTranslation(
    'participantsAndProviders'
  );
  const { t: participantsAndProvidersMiscT } = useTranslation(
    'participantsAndProvidersMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    participantRequireFinancialGuarantee: participantRequireFinancialGuaranteeConfig,
    participantRequireFinancialGuaranteeType: participantRequireFinancialGuaranteeTypeConfig,
    coordinateWork: coordinateWorkConfig,
    gainsharePayments: gainsharePaymentsConfig,
    gainsharePaymentsTrack: gainsharePaymentsTrackConfig,
    gainsharePaymentsEligibility: gainsharePaymentsEligibilityConfig,
    participantsIds: participantsIdsConfig
  } = usePlanTranslation('participantsAndProviders');

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<CoordinationFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useGetCoordinationQuery({
    variables: {
      id: modelID
    }
  });

  const {
    id,
    participantRequireFinancialGuarantee,
    participantRequireFinancialGuaranteeType,
    participantRequireFinancialGuaranteeOther,
    participantRequireFinancialGuaranteeNote,
    coordinateWork,
    coordinateWorkNote,
    gainsharePayments,
    gainsharePaymentsTrack,
    gainsharePaymentsEligibility,
    gainsharePaymentsEligibilityOther,
    gainsharePaymentsNote,
    participantsIds,
    participantsIdsOther,
    participantsIDSNote
  } = (data?.modelPlan?.participantsAndProviders || {}) as CoordinationFormType;

  const modelName = data?.modelPlan?.modelName || '';

  const itSolutionsStarted: boolean = !!data?.modelPlan.operationalNeeds.find(
    need => need.modifiedDts
  );

  // If redirected from Operational Solutions, scrolls to the relevant question
  useScrollElement(!loading);

  const { mutationError } = useHandleMutation(
    TypedUpdatePlanParticipantsAndProvidersDocument,
    {
      id,
      formikRef
    }
  );

  const initialValues: CoordinationFormType = {
    __typename: 'PlanParticipantsAndProviders',
    id: id ?? '',
    participantRequireFinancialGuarantee:
      participantRequireFinancialGuarantee ?? null,
    participantRequireFinancialGuaranteeType:
      participantRequireFinancialGuaranteeType ?? [],
    participantRequireFinancialGuaranteeOther:
      participantRequireFinancialGuaranteeOther ?? '',
    participantRequireFinancialGuaranteeNote:
      participantRequireFinancialGuaranteeNote ?? '',
    coordinateWork: coordinateWork ?? null,
    coordinateWorkNote: coordinateWorkNote ?? '',
    gainsharePayments: gainsharePayments ?? null,
    gainsharePaymentsTrack: gainsharePaymentsTrack ?? null,
    gainsharePaymentsEligibility: gainsharePaymentsEligibility ?? null,
    gainsharePaymentsEligibilityOther: gainsharePaymentsEligibilityOther ?? '',
    gainsharePaymentsNote: gainsharePaymentsNote ?? '',
    participantsIds: participantsIds ?? [],
    participantsIdsOther: participantsIdsOther ?? '',
    participantsIDSNote: participantsIDSNote ?? ''
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

      <Breadcrumbs
        items={[
          BreadcrumbItemOptions.HOME,
          BreadcrumbItemOptions.COLLABORATION_AREA,
          BreadcrumbItemOptions.TASK_LIST,
          BreadcrumbItemOptions.PARTICIPANTS_AND_PROVIDERS
        ]}
      />

      <PageHeading className="margin-top-4 margin-bottom-2">
        {participantsAndProvidersMiscT('heading')}
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
            `/models/${modelID}/collaboration-area/task-list/participants-and-providers/provider-options`
          );
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<CoordinationFormType>) => {
          const {
            errors,
            handleSubmit,
            setErrors,
            setFieldValue,
            values
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
                data-testid="participants-and-providers-coordination-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={!!error || loading}>
                  <FieldGroup scrollElement="participantRequireFinancialGuarantee">
                    <div className="display-flex flex-align-center">
                      <Label htmlFor="participants-and-providers-participant-require-financial-guarantee">
                        {participantsAndProvidersT(
                          'participantRequireFinancialGuarantee.label'
                        )}
                      </Label>
                      {participantRequireFinancialGuaranteeConfig.questionTooltip && (
                        <Tooltip
                          className="margin-left-1"
                          label={
                            participantRequireFinancialGuaranteeConfig.questionTooltip
                          }
                          position="right"
                        >
                          <Icon.Info className="text-base-light" />
                        </Tooltip>
                      )}
                    </div>

                    <p className="text-base margin-0 line-height-body-3">
                      {participantsAndProvidersT(
                        'participantRequireFinancialGuarantee.sublabel'
                      )}
                    </p>

                    <BooleanRadio
                      field="participantRequireFinancialGuarantee"
                      id="participants-and-providers-participant-require-financial-guarantee"
                      value={values.participantRequireFinancialGuarantee}
                      setFieldValue={setFieldValue}
                      options={
                        participantRequireFinancialGuaranteeConfig.options
                      }
                    />

                    {values.participantRequireFinancialGuarantee && (
                      <FieldGroup scrollElement="participantRequireFinancialGuaranteeType">
                        <Label
                          htmlFor="participants-and-providers-participant-require-financial-guarantee-type"
                          className="text-normal margin-top-4"
                        >
                          {participantsAndProvidersT(
                            'participantRequireFinancialGuaranteeType.label'
                          )}
                        </Label>

                        {getKeys(
                          participantRequireFinancialGuaranteeTypeConfig.options
                        ).map(type => {
                          return (
                            <Fragment key={type}>
                              <Field
                                as={CheckboxField}
                                id={`participants-and-providers-participant-require-financial-guarantee-type-${type}`}
                                name="participantRequireFinancialGuaranteeType"
                                label={
                                  participantRequireFinancialGuaranteeTypeConfig
                                    .options[type]
                                }
                                value={type}
                                checked={values?.participantRequireFinancialGuaranteeType.includes(
                                  type
                                )}
                              />

                              {type ===
                                ParticipantRequireFinancialGuaranteeType.OTHER &&
                                values.participantRequireFinancialGuaranteeType.includes(
                                  type
                                ) && (
                                  <div className="margin-left-4">
                                    <Label
                                      htmlFor="participants-and-providers-participant-require-financial-guarantee-type-other"
                                      className="text-normal margin-top-1"
                                    >
                                      {participantsAndProvidersT(
                                        'participantRequireFinancialGuaranteeOther.label'
                                      )}
                                    </Label>

                                    <Field
                                      as={TextInput}
                                      className="maxw-none mint-textarea"
                                      id="participants-and-providers-participant-eligibility-other"
                                      data-testid="participants-and-providers-participant-eligibility-other"
                                      name="participantRequireFinancialGuaranteeOther"
                                    />
                                  </div>
                                )}
                            </Fragment>
                          );
                        })}
                      </FieldGroup>
                    )}

                    <AddNote
                      id="participants-and-providers-participant-require-financial-guarantee-note"
                      field="participantRequireFinancialGuaranteeNote"
                    />
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="coordinateWork"
                    error={!!flatErrors.coordinateWork}
                    className="margin-bottom-8"
                  >
                    <Label htmlFor="participants-and-providers-coordniate-work">
                      {participantsAndProvidersT('coordinateWork.label')}
                    </Label>

                    <p className="text-base margin-0 line-height-body-3">
                      {participantsAndProvidersT('coordinateWork.sublabel')}
                    </p>

                    <FieldErrorMsg>{flatErrors.coordinateWork}</FieldErrorMsg>

                    <BooleanRadio
                      field="coordinateWork"
                      id="participants-and-providers-coordniate-work"
                      value={values.coordinateWork}
                      setFieldValue={setFieldValue}
                      options={coordinateWorkConfig.options}
                    />

                    <AddNote
                      id="participants-and-providers-coordniate-work-note"
                      field="coordinateWorkNote"
                    />
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="gainsharePayments"
                    error={!!flatErrors.gainsharePayments}
                    className="margin-y-4 margin-bottom-8"
                  >
                    <Label htmlFor="participants-and-providers-gainshare-payment">
                      {participantsAndProvidersT('gainsharePayments.label')}
                    </Label>

                    <FieldErrorMsg>
                      {flatErrors.gainsharePayments}
                    </FieldErrorMsg>

                    <BooleanRadio
                      field="gainsharePayments"
                      id="participants-and-providers-gainshare-payment"
                      value={values.gainsharePayments}
                      setFieldValue={setFieldValue}
                      options={gainsharePaymentsConfig.options}
                    />

                    {values.gainsharePayments && (
                      <FieldGroup
                        scrollElement="gainsharePaymentsTrack"
                        error={!!flatErrors.gainsharePaymentsTrack}
                        className="margin-top-4"
                      >
                        <Label
                          htmlFor="participants-and-providers-gainshare-track"
                          className="text-normal"
                        >
                          {participantsAndProvidersT(
                            'gainsharePaymentsTrack.label'
                          )}
                        </Label>

                        <FieldErrorMsg>
                          {flatErrors.gainsharePaymentsTrack}
                        </FieldErrorMsg>

                        <BooleanRadio
                          field="gainsharePaymentsTrack"
                          id="participants-and-providers-gainshare-track"
                          value={values.gainsharePaymentsTrack}
                          setFieldValue={setFieldValue}
                          options={gainsharePaymentsTrackConfig.options}
                        />
                      </FieldGroup>
                    )}

                    {values.gainsharePayments && (
                      <FieldGroup
                        scrollElement="gainsharePaymentsEligibility"
                        error={!!flatErrors.gainsharePaymentsEligibility}
                        className="margin-top-4"
                      >
                        <Label
                          htmlFor="participants-and-providers-gainshare-eligibility"
                          className="text-normal maxw-none"
                        >
                          {participantsAndProvidersT(
                            'gainsharePaymentsEligibility.label'
                          )}
                        </Label>

                        <FieldErrorMsg>
                          {flatErrors.gainsharePaymentsEligibility}
                        </FieldErrorMsg>

                        {getKeys(
                          gainsharePaymentsEligibilityConfig.options
                        ).map(type => {
                          return (
                            <Fragment key={type}>
                              <Field
                                as={CheckboxField}
                                id={`participants-and-providers-participant-eligibility-${type}`}
                                name="gainsharePaymentsEligibility"
                                label={
                                  gainsharePaymentsEligibilityConfig.options[
                                    type
                                  ]
                                }
                                value={type}
                                checked={values?.gainsharePaymentsEligibility.includes(
                                  type
                                )}
                              />

                              {type === GainshareArrangementEligibility.OTHER &&
                                values.gainsharePaymentsEligibility.includes(
                                  type
                                ) && (
                                  <div className="margin-left-4">
                                    <Label
                                      htmlFor="participants-and-providers-participant-eligibility-other"
                                      className="text-normal margin-top-1"
                                    >
                                      {participantsAndProvidersT(
                                        'gainsharePaymentsEligibilityOther.label'
                                      )}
                                    </Label>

                                    <FieldErrorMsg>
                                      {
                                        flatErrors.gainsharePaymentsEligibilityOther
                                      }
                                    </FieldErrorMsg>

                                    <Field
                                      as={TextInput}
                                      className="maxw-none mint-textarea"
                                      id="participants-and-providers-participant-eligibility-other"
                                      data-testid="participants-and-providers-participant-eligibility-other"
                                      name="gainsharePaymentsEligibilityOther"
                                    />
                                  </div>
                                )}
                            </Fragment>
                          );
                        })}
                      </FieldGroup>
                    )}

                    <AddNote
                      id="participants-and-providers-gainshare-payment-note"
                      field="gainsharePaymentsNote"
                    />
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="participantsIds"
                    error={!!flatErrors.participantsIds}
                  >
                    <Label
                      htmlFor="participants-and-providers-id"
                      className="maxw-none"
                    >
                      {participantsAndProvidersT('participantsIds.label')}
                    </Label>

                    {itSolutionsStarted && (
                      <ITSolutionsWarning
                        id="ops-eval-and-learning-data-needed-warning"
                        onClick={() =>
                          history.push(
                            `/models/${modelID}/collaboration-area/task-list/it-solutions`
                          )
                        }
                      />
                    )}

                    <p className="text-base margin-0 line-height-body-3">
                      {participantsAndProvidersT('participantsIds.sublabel')}
                    </p>

                    <FieldErrorMsg>{flatErrors.participantsIds}</FieldErrorMsg>

                    {getKeys(participantsIdsConfig.options).map(type => {
                      return (
                        <Fragment key={type}>
                          <Field
                            as={CheckboxField}
                            id={`participants-and-providers-participant-id-${type}`}
                            name="participantsIds"
                            label={participantsIdsConfig.options[type]}
                            value={type}
                            checked={values?.participantsIds.includes(type)}
                          />

                          {type === ParticipantsIdType.OTHER &&
                            values.participantsIds.includes(type) && (
                              <div className="margin-left-4">
                                <Label
                                  htmlFor="participants-and-providers-participant-id-other"
                                  className="text-normal margin-top-1"
                                >
                                  {participantsAndProvidersT(
                                    'participantsIdsOther.label'
                                  )}
                                </Label>

                                <FieldErrorMsg>
                                  {flatErrors.participantsIdsOther}
                                </FieldErrorMsg>

                                <Field
                                  as={TextInput}
                                  className="maxw-none mint-textarea"
                                  id="participants-and-providers-participant-id-other"
                                  data-testid="participants-and-providers-participant-id-other"
                                  maxLength={5000}
                                  name="participantsIdsOther"
                                />
                              </div>
                            )}
                        </Fragment>
                      );
                    })}
                    <AddNote
                      id="participants-and-providers-participant-id-note"
                      field="participantsIDSNote"
                    />
                  </FieldGroup>

                  <div className="margin-top-6 margin-bottom-3">
                    <Button
                      type="button"
                      className="usa-button usa-button--outline margin-bottom-1"
                      onClick={() => {
                        history.push(
                          `/models/${modelID}/collaboration-area/task-list/participants-and-providers/communication`
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
                    <Icon.ArrowBack className="margin-right-1" aria-hidden />

                    {miscellaneousT('saveAndReturn')}
                  </Button>
                </Fieldset>
              </Form>
            </>
          );
        }}
      </Formik>

      <PageNumber currentPage={4} totalPages={5} className="margin-y-6" />
    </>
  );
};

export default Coordination;
