import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Icon,
  Label,
  Radio,
  RangeInput,
  TextInput
} from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  GetParticipantOptionsQuery,
  ParticipantSelectionType,
  RecruitmentType,
  TypedUpdatePlanParticipantsAndProvidersDocument,
  useGetParticipantOptionsQuery
} from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import FieldGroup from 'components/FieldGroup';
import MTOWarning from 'components/MTOWarning';
import MultiSelect from 'components/MultiSelect';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import TextAreaField from 'components/TextAreaField';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import useScrollElement from 'hooks/useScrollElement';
import { getKeys } from 'types/translation';
import { composeMultiSelectOptions } from 'utils/modelPlan';

type ParticipantOptionsFormType =
  GetParticipantOptionsQuery['modelPlan']['participantsAndProviders'];

export const ParticipantOptions = () => {
  const { t: participantsAndProvidersT } = useTranslation(
    'participantsAndProviders'
  );
  const { t: participantsAndProvidersMiscT } = useTranslation(
    'participantsAndProvidersMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    estimateConfidence: estimateConfidenceConfig,
    recruitmentMethod: recruitmentMethodConfig,
    selectionMethod: selectionMethodConfig
  } = usePlanTranslation('participantsAndProviders');

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<ParticipantOptionsFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useGetParticipantOptionsQuery({
    variables: {
      id: modelID
    }
  });

  const {
    id,
    expectedNumberOfParticipants,
    estimateConfidence,
    confidenceNote,
    recruitmentMethod,
    recruitmentOther,
    recruitmentNote,
    selectionMethod,
    selectionOther,
    selectionNote
  } = (data?.modelPlan?.participantsAndProviders ||
    {}) as ParticipantOptionsFormType;

  const modelName = data?.modelPlan?.modelName || '';

  // If redirected from Operational Solutions, scrolls to the relevant question
  useScrollElement(!loading);

  const { mutationError } = useHandleMutation(
    TypedUpdatePlanParticipantsAndProvidersDocument,
    {
      id,
      formikRef
    }
  );

  const initialValues: ParticipantOptionsFormType = {
    __typename: 'PlanParticipantsAndProviders',
    id: id ?? '',
    expectedNumberOfParticipants: expectedNumberOfParticipants ?? 0,
    estimateConfidence: estimateConfidence ?? null,
    confidenceNote: confidenceNote ?? '',
    recruitmentMethod: recruitmentMethod ?? null,
    recruitmentOther: recruitmentOther ?? '',
    recruitmentNote: recruitmentNote ?? '',
    selectionMethod: selectionMethod ?? [],
    selectionOther: selectionOther ?? '',
    selectionNote: selectionNote ?? ''
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
            `/models/${modelID}/collaboration-area/task-list/participants-and-providers/communication`
          );
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<ParticipantOptionsFormType>) => {
          const { handleSubmit, setErrors, setFieldValue, values } =
            formikProps;

          return (
            <>
              <ConfirmLeave />

              <Form
                className="desktop:grid-col-6 margin-top-6"
                data-testid="participants-and-providers-options-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={!!error || loading}>
                  <FieldGroup>
                    <Label htmlFor="participants-and-providers-expected-participants">
                      {participantsAndProvidersT(
                        'expectedNumberOfParticipants.label'
                      )}
                    </Label>

                    <p className="text-base margin-0 line-height-body-3">
                      {participantsAndProvidersT(
                        'expectedNumberOfParticipants.sublabel'
                      )}
                    </p>

                    <Field
                      as={RangeInput}
                      className="maxw-none width-full"
                      id="participants-and-providers-expected-participants"
                      data-testid="participants-and-providers-expected-participants"
                      name="expectedNumberOfParticipants"
                      min={0}
                      max={10000}
                      step={1}
                      onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue(
                          'expectedNumberOfParticipants',
                          Number(e.target.value)
                        );
                      }}
                    />

                    <div className="display-flex mint-header__basic flex-justify">
                      <span>{participantsAndProvidersMiscT('zero')}</span>
                      <span>
                        {participantsAndProvidersMiscT('tenThousand')}
                      </span>
                    </div>

                    <Label
                      htmlFor="participants-and-providers-participants-other-input"
                      className="text-normal"
                    >
                      {participantsAndProvidersMiscT('numberOfParticipants')}
                    </Label>

                    <Field
                      as={TextInput}
                      type="number"
                      className="width-card"
                      id="participants-and-providers-participants-other-input"
                      name="expectedNumberOfParticipants"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (Number.isNaN(e.target.value)) return;
                        setFieldValue(
                          'expectedNumberOfParticipants',
                          Number(e.target.value)
                        );
                      }}
                    />

                    <Label
                      htmlFor="participants-and-providers-current-participants"
                      className="text-normal"
                    >
                      {participantsAndProvidersT('estimateConfidence.label')}
                    </Label>

                    <Fieldset>
                      {getKeys(estimateConfidenceConfig.options).map(key => (
                        <Field
                          as={Radio}
                          key={key}
                          id={`participants-and-providers-confidence-${key}`}
                          name="estimateConfidence"
                          label={estimateConfidenceConfig.options[key]}
                          value={key}
                          checked={values.estimateConfidence === key}
                        />
                      ))}
                    </Fieldset>

                    <AddNote
                      id="participants-and-providers-confidence-note"
                      field="confidenceNote"
                    />
                  </FieldGroup>

                  <FieldGroup>
                    <Label htmlFor="participants-and-providers-recruitment-method">
                      {participantsAndProvidersT('recruitmentMethod.label')}
                    </Label>

                    <MTOWarning id="participants-and-providers-recruitment-method-warning" />

                    <Fieldset>
                      {getKeys(recruitmentMethodConfig.options).map(key => (
                        <Fragment key={key}>
                          <Field
                            as={Radio}
                            id={`participants-and-providers-recruitment-method-${key}`}
                            name="recruitmentMethod"
                            label={recruitmentMethodConfig.options[key]}
                            value={key}
                            checked={values.recruitmentMethod === key}
                          />

                          {key === RecruitmentType.NOFO && (
                            <p className="text-base margin-bottom-neg-05 margin-left-4 margin-top-1 line-height-body-3">
                              {recruitmentMethodConfig.optionsLabels?.NOFO}
                            </p>
                          )}

                          {key === RecruitmentType.OTHER &&
                            values.recruitmentMethod === key && (
                              <div className="margin-left-4 margin-top-1">
                                <Label
                                  htmlFor="participants-and-providers-recruitment-other"
                                  className="text-normal"
                                >
                                  {participantsAndProvidersT(
                                    'recruitmentOther.label'
                                  )}
                                </Label>
                                <Field
                                  as={TextAreaField}
                                  className="maxw-none mint-textarea"
                                  id="participants-and-providers-recruitment-other"
                                  maxLength={5000}
                                  name="recruitmentOther"
                                />
                              </div>
                            )}
                        </Fragment>
                      ))}
                    </Fieldset>

                    <AddNote
                      id="participants-and-providers-recruitment-method-note"
                      field="recruitmentNote"
                    />
                  </FieldGroup>

                  <FieldGroup className="margin-top-4">
                    <Label
                      htmlFor="participants-and-providers-selection-method"
                      id="label-participants-and-providers-selection-method"
                    >
                      {participantsAndProvidersT('selectionMethod.label')}
                    </Label>

                    <MTOWarning id="participants-and-providers-selection-method-warning" />

                    <Field
                      as={MultiSelect}
                      id="participants-and-providers-selection-method"
                      name="selectionMethod"
                      arialabel="label-participants-and-providers-selection-method"
                      options={composeMultiSelectOptions(
                        selectionMethodConfig.options
                      )}
                      selectedLabel={participantsAndProvidersT(
                        'selectionMethod.multiSelectLabel'
                      )}
                      onChange={(value: string[] | []) => {
                        setFieldValue('selectionMethod', value);
                      }}
                      initialValues={initialValues.selectionMethod}
                    />

                    {(values?.selectionMethod || []).includes(
                      ParticipantSelectionType.OTHER
                    ) && (
                      <FieldGroup>
                        <Label
                          htmlFor="participants-and-providers-selection-other"
                          className="text-normal"
                        >
                          {participantsAndProvidersT('selectionOther.label')}
                        </Label>

                        <Field
                          as={TextAreaField}
                          className="height-15"
                          id="participants-and-providers-selection-other"
                          name="selectionOther"
                        />
                      </FieldGroup>
                    )}

                    <AddNote
                      id="participants-and-providers-selection-note"
                      field="selectionNote"
                    />
                  </FieldGroup>

                  <div className="margin-top-6 margin-bottom-3">
                    <Button
                      type="button"
                      className="usa-button usa-button--outline margin-bottom-1"
                      onClick={() => {
                        history.push(
                          `/models/${modelID}/collaboration-area/task-list/participants-and-providers`
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

      <PageNumber currentPage={2} totalPages={5} className="margin-y-6" />
    </>
  );
};

export default ParticipantOptions;
