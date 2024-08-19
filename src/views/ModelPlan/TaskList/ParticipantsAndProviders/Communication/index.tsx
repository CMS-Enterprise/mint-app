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
  GetCommunicationQuery,
  ParticipantCommunicationType,
  ParticipantRiskType,
  TypedUpdatePlanParticipantsAndProvidersDocument,
  useGetCommunicationQuery
} from 'gql/gen/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import FrequencyForm from 'components/FrequencyForm';
import ITSolutionsWarning from 'components/ITSolutionsWarning';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import useScrollElement from 'hooks/useScrollElement';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { NotFoundPartial } from 'views/NotFound';

type CommunicationFormType = GetCommunicationQuery['modelPlan']['participantsAndProviders'];

export const Communication = () => {
  const { t: participantsAndProvidersT } = useTranslation(
    'participantsAndProviders'
  );
  const { t: participantsAndProvidersMiscT } = useTranslation(
    'participantsAndProvidersMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    participantAddedFrequency: participantAddedFrequencyConfig,
    participantRemovedFrequency: participantRemovedFrequencyConfig,
    communicationMethod: communicationMethodConfig,
    riskType: riskTypeConfig,
    willRiskChange: willRiskChangeConfig
  } = usePlanTranslation('participantsAndProviders');

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<CommunicationFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useGetCommunicationQuery({
    variables: {
      id: modelID
    }
  });

  const {
    id,
    participantAddedFrequency,
    participantAddedFrequencyContinually,
    participantAddedFrequencyOther,
    participantAddedFrequencyNote,
    participantRemovedFrequency,
    participantRemovedFrequencyContinually,
    participantRemovedFrequencyOther,
    participantRemovedFrequencyNote,
    communicationMethod,
    communicationMethodOther,
    communicationNote,
    riskType,
    riskOther,
    riskNote,
    willRiskChange,
    willRiskChangeNote
  } = (data?.modelPlan?.participantsAndProviders ||
    {}) as CommunicationFormType;

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

  const initialValues: CommunicationFormType = {
    __typename: 'PlanParticipantsAndProviders',
    id: id ?? '',
    participantAddedFrequency: participantAddedFrequency ?? [],
    participantAddedFrequencyContinually:
      participantAddedFrequencyContinually ?? '',
    participantAddedFrequencyOther: participantAddedFrequencyOther ?? '',
    participantAddedFrequencyNote: participantAddedFrequencyNote ?? '',
    participantRemovedFrequency: participantRemovedFrequency ?? [],
    participantRemovedFrequencyContinually:
      participantRemovedFrequencyContinually ?? '',
    participantRemovedFrequencyOther: participantRemovedFrequencyOther ?? '',
    participantRemovedFrequencyNote: participantRemovedFrequencyNote ?? '',
    communicationMethod: communicationMethod ?? [],
    communicationMethodOther: communicationMethodOther ?? '',
    communicationNote: communicationNote ?? '',
    riskType: riskType ?? [],
    riskOther: riskOther ?? '',
    riskNote: riskNote ?? '',
    willRiskChange: willRiskChange ?? null,
    willRiskChangeNote: willRiskChangeNote ?? ''
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
            `/models/${modelID}/collaboration-area/task-list/participants-and-providers/coordination`
          );
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<CommunicationFormType>) => {
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
                data-testid="participants-and-providers-communication-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={!!error || loading}>
                  <FrequencyForm
                    field="participantAddedFrequency"
                    values={values.participantAddedFrequency}
                    config={participantAddedFrequencyConfig}
                    nameSpace="participantsAndProviders"
                    id="participant-added-frequency"
                    label={participantsAndProvidersT(
                      'participantAddedFrequency.label'
                    )}
                    disabled={loading}
                  />

                  <FrequencyForm
                    field="participantRemovedFrequency"
                    values={values.participantRemovedFrequency}
                    config={participantRemovedFrequencyConfig}
                    nameSpace="participantsAndProviders"
                    id="participant-removed-frequency"
                    label={participantsAndProvidersT(
                      'participantRemovedFrequency.label'
                    )}
                    disabled={loading}
                  />

                  <FieldGroup
                    scrollElement="participants-and-providers-communication-method"
                    error={!!flatErrors.communicationMethod}
                  >
                    <Label htmlFor="participants-and-providers-communication-method">
                      {participantsAndProvidersT('communicationMethod.label')}
                    </Label>

                    {itSolutionsStarted && (
                      <ITSolutionsWarning
                        id="participants-and-providers-communication-method-warning"
                        onClick={() =>
                          history.push(
                            `/models/${modelID}/collaboration-area/task-list/it-solutions`
                          )
                        }
                      />
                    )}

                    <FieldErrorMsg>
                      {flatErrors.communicationMethod}
                    </FieldErrorMsg>

                    {getKeys(communicationMethodConfig.options).map(type => {
                      return (
                        <Fragment key={type}>
                          <Field
                            as={CheckboxField}
                            id={`participants-and-providers-communication-method-${type}`}
                            name="communicationMethod"
                            label={communicationMethodConfig.options[type]}
                            value={type}
                            checked={values?.communicationMethod.includes(type)}
                          />

                          {type === ParticipantCommunicationType.OTHER &&
                            values.communicationMethod.includes(
                              ParticipantCommunicationType.OTHER
                            ) && (
                              <div className="margin-left-4">
                                <Label
                                  htmlFor="participants-and-providers-communication-method-other"
                                  className="text-normal"
                                >
                                  {participantsAndProvidersT(
                                    'communicationMethodOther.label'
                                  )}
                                </Label>

                                <FieldErrorMsg>
                                  {flatErrors.communicationMethodOther}
                                </FieldErrorMsg>

                                <Field
                                  as={TextInput}
                                  id="participants-and-providers-communication-method-other"
                                  name="communicationMethodOther"
                                />
                              </div>
                            )}
                        </Fragment>
                      );
                    })}
                    <AddNote
                      id="participants-and-providers-communication-method-note"
                      field="communicationNote"
                    />
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="participants-and-providers-risk-type"
                    error={!!flatErrors.riskType}
                    className="margin-y-4 margin-bottom-8"
                  >
                    <Label htmlFor="participants-and-providers-risk-type">
                      {participantsAndProvidersT('riskType.label')}
                    </Label>

                    <FieldErrorMsg>{flatErrors.riskType}</FieldErrorMsg>

                    <Fieldset>
                      {getKeys(riskTypeConfig.options).map(key => (
                        <Fragment key={key}>
                          <Field
                            as={CheckboxField}
                            id={`participants-and-providers-risk-type-${key}`}
                            name="riskType"
                            label={riskTypeConfig.options[key]}
                            value={key}
                            checked={values.riskType?.includes(key)}
                          />
                        </Fragment>
                      ))}
                      {values.riskType?.includes(ParticipantRiskType.OTHER) && (
                        <div className="margin-left-4">
                          <Label
                            htmlFor="participants-and-providers-risk-type-other"
                            className="text-normal"
                          >
                            {participantsAndProvidersT('riskOther.label')}
                          </Label>

                          <FieldErrorMsg>{flatErrors.riskOther}</FieldErrorMsg>

                          <Field
                            as={TextInput}
                            className="maxw-none mint-textarea"
                            id="participants-and-providers-risk-type-other"
                            data-testid="participants-and-providers-risk-type-other"
                            name="riskOther"
                          />
                        </div>
                      )}
                    </Fieldset>
                    <AddNote
                      id="participants-and-providers-risk-note"
                      field="riskNote"
                    />
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="participants-and-providers-risk-change"
                    error={!!flatErrors.willRiskChange}
                    className="margin-y-4 margin-bottom-8"
                  >
                    <Label htmlFor="participants-and-providers-risk-change">
                      {participantsAndProvidersT('willRiskChange.label')}
                    </Label>

                    <FieldErrorMsg>{flatErrors.willRiskChange}</FieldErrorMsg>

                    <BooleanRadio
                      field="willRiskChange"
                      id="participants-and-providers-risk-change"
                      value={values.willRiskChange}
                      setFieldValue={setFieldValue}
                      options={willRiskChangeConfig.options}
                    />

                    <AddNote
                      id="participants-and-providers-risk-change-note"
                      field="willRiskChangeNote"
                    />
                  </FieldGroup>

                  <div className="margin-top-6 margin-bottom-3">
                    <Button
                      type="button"
                      className="usa-button usa-button--outline margin-bottom-1"
                      onClick={() => {
                        history.push(
                          `/models/${modelID}/collaboration-area/task-list/participants-and-providers/participants-options`
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

      <PageNumber currentPage={3} totalPages={5} className="margin-y-6" />
    </>
  );
};

export default Communication;
