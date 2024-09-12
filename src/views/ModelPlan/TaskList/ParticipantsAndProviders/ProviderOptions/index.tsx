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
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  GetProviderOptionsQuery,
  OverlapType,
  ProviderAddType,
  ProviderLeaveType,
  TypedUpdatePlanParticipantsAndProvidersDocument,
  useGetProviderOptionsQuery
} from 'gql/gen/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import FrequencyForm from 'components/FrequencyForm';
import ITSolutionsWarning from 'components/ITSolutionsWarning';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import ReadyForReview from 'components/ReadyForReview';
import CheckboxField from 'components/shared/CheckboxField';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import TextAreaField from 'components/shared/TextAreaField';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import useScrollElement from 'hooks/useScrollElement';
import { getKeys } from 'types/translation';
import { composeMultiSelectOptions } from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

type ProviderOptionsFormType =
  GetProviderOptionsQuery['modelPlan']['participantsAndProviders'];

export const ProviderOptions = () => {
  const { t: participantsAndProvidersT } = useTranslation(
    'participantsAndProviders'
  );
  const { t: participantsAndProvidersMiscT } = useTranslation(
    'participantsAndProvidersMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    providerAdditionFrequency: providerAdditionFrequencyConfig,
    providerAddMethod: providerAddMethodConfig,
    providerLeaveMethod: providerLeaveMethodConfig,
    providerRemovalFrequency: providerRemovalFrequencyConfig,
    providerOverlap: providerOverlapConfig
  } = usePlanTranslation('participantsAndProviders');

  const { modelID } = useParams<{ modelID: string }>();

  // Omitting readyForReviewBy and readyForReviewDts from initialValues and getting submitted through Formik
  type InitialValueType = Omit<
    ProviderOptionsFormType,
    'readyForReviewByUserAccount' | 'readyForReviewDts'
  >;

  const formikRef = useRef<FormikProps<InitialValueType>>(null);
  const history = useHistory();

  const { data, loading, error } = useGetProviderOptionsQuery({
    variables: {
      id: modelID
    }
  });

  const {
    id,
    providerAdditionFrequency,
    providerAdditionFrequencyContinually,
    providerAdditionFrequencyOther,
    providerAdditionFrequencyNote,
    providerAddMethod,
    providerAddMethodOther,
    providerAddMethodNote,
    providerLeaveMethod,
    providerLeaveMethodOther,
    providerLeaveMethodNote,
    providerRemovalFrequency,
    providerRemovalFrequencyContinually,
    providerRemovalFrequencyOther,
    providerRemovalFrequencyNote,
    providerOverlap,
    providerOverlapHierarchy,
    providerOverlapNote,
    readyForReviewByUserAccount,
    readyForReviewDts,
    status
  } = (data?.modelPlan?.participantsAndProviders ||
    {}) as ProviderOptionsFormType;

  const modelName = data?.modelPlan?.modelName || '';

  const itSolutionsStarted: boolean = !!data?.modelPlan.operationalNeeds.find(
    need => need.modifiedDts
  );

  useScrollElement(!loading);

  const { mutationError } = useHandleMutation(
    TypedUpdatePlanParticipantsAndProvidersDocument,
    {
      id,
      formikRef
    }
  );

  const initialValues: InitialValueType = {
    __typename: 'PlanParticipantsAndProviders',
    id: id ?? '',
    providerAdditionFrequency: providerAdditionFrequency ?? [],
    providerAdditionFrequencyContinually:
      providerAdditionFrequencyContinually ?? '',
    providerAdditionFrequencyOther: providerAdditionFrequencyOther ?? '',
    providerAdditionFrequencyNote: providerAdditionFrequencyNote ?? '',
    providerAddMethod: providerAddMethod ?? [],
    providerAddMethodOther: providerAddMethodOther ?? '',
    providerAddMethodNote: providerAddMethodNote ?? '',
    providerLeaveMethod: providerLeaveMethod ?? [],
    providerLeaveMethodOther: providerLeaveMethodOther ?? '',
    providerLeaveMethodNote: providerLeaveMethodNote ?? '',
    providerRemovalFrequency: providerRemovalFrequency ?? [],
    providerRemovalFrequencyContinually:
      providerRemovalFrequencyContinually ?? '',
    providerRemovalFrequencyOther: providerRemovalFrequencyOther ?? '',
    providerRemovalFrequencyNote: providerRemovalFrequencyNote ?? '',
    providerOverlap: providerOverlap ?? null,
    providerOverlapHierarchy: providerOverlapHierarchy ?? '',
    providerOverlapNote: providerOverlapNote ?? '',
    status
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
            `/models/${modelID}/collaboration-area/task-list/beneficiaries`
          );
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<InitialValueType>) => {
          const { handleSubmit, setErrors, setFieldValue, values } =
            formikProps;

          return (
            <>
              <ConfirmLeave />

              <Form
                className="desktop:grid-col-6 margin-top-6"
                data-testid="participants-and-providers-providers-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={!!error || loading}>
                  <FrequencyForm
                    field="providerAdditionFrequency"
                    values={values.providerAdditionFrequency}
                    config={providerAdditionFrequencyConfig}
                    nameSpace="participantsAndProviders"
                    id="participants-and-providers-additional-frequency"
                    label={participantsAndProvidersT(
                      'providerAdditionFrequency.label'
                    )}
                    disabled={loading}
                  />

                  <FieldGroup className="margin-top-4">
                    <Label
                      htmlFor="participants-and-providers-provider-add-method"
                      id="label-participants-and-providers-provider-add-method"
                    >
                      {participantsAndProvidersT('providerAddMethod.label')}
                    </Label>

                    <p className="text-base margin-top-1 margin-bottom-0 line-height-body-3">
                      {participantsAndProvidersT('providerAddMethod.sublabel')}
                    </p>

                    <Field
                      as={MultiSelect}
                      id="participants-and-providers-provider-add-method"
                      name="providerAddMethod"
                      ariaLabel="label-participants-and-providers-provider-add-method"
                      options={composeMultiSelectOptions(
                        providerAddMethodConfig.options
                      )}
                      selectedLabel={participantsAndProvidersT(
                        'providerAddMethod.multiSelectLabel'
                      )}
                      onChange={(value: string[] | []) => {
                        setFieldValue('providerAddMethod', value);
                      }}
                      initialValues={initialValues.providerAddMethod}
                    />

                    {(values?.providerAddMethod || []).includes(
                      ProviderAddType.OTHER
                    ) && (
                      <FieldGroup>
                        <Label
                          htmlFor="participants-and-providers-provider-add-method-other"
                          className="text-normal"
                        >
                          {participantsAndProvidersT(
                            'providerAddMethodOther.label'
                          )}
                        </Label>

                        <Field
                          as={TextAreaField}
                          className="height-15"
                          id="participants-and-providers-provider-add-method-other"
                          data-testid="participants-and-providers-provider-add-method-other"
                          name="providerAddMethodOther"
                        />
                      </FieldGroup>
                    )}

                    <AddNote
                      id="participants-and-providers-provider-add-method-note"
                      field="providerAddMethodNote"
                    />
                  </FieldGroup>

                  <FieldGroup className="margin-top-4">
                    <Label htmlFor="participants-and-providers-leave-method">
                      {participantsAndProvidersT('providerLeaveMethod.label')}
                    </Label>

                    <p className="text-base margin-top-1 margin-bottom-0 line-height-body-3">
                      {participantsAndProvidersT(
                        'providerLeaveMethod.sublabel'
                      )}
                    </p>

                    {getKeys(providerLeaveMethodConfig.options).map(type => {
                      return (
                        <Fragment key={type}>
                          <Field
                            as={CheckboxField}
                            id={`participants-and-providers-leave-method-${type}`}
                            name="providerLeaveMethod"
                            label={providerLeaveMethodConfig.options[type]}
                            value={type}
                            checked={values?.providerLeaveMethod.includes(type)}
                          />

                          {type === ProviderLeaveType.OTHER &&
                            values.providerLeaveMethod.includes(
                              ProviderLeaveType.OTHER
                            ) && (
                              <div className="margin-left-4">
                                <Label
                                  htmlFor="participants-and-providers-leave-method-other"
                                  className="text-normal"
                                >
                                  {participantsAndProvidersT(
                                    'providerLeaveMethodOther.label'
                                  )}
                                </Label>

                                <Field
                                  as={TextInput}
                                  id="participants-and-providers-leave-method-other"
                                  name="providerLeaveMethodOther"
                                />
                              </div>
                            )}
                        </Fragment>
                      );
                    })}
                    <AddNote
                      id="participants-and-providers-leave-method-note"
                      field="providerLeaveMethodNote"
                    />
                  </FieldGroup>

                  <FrequencyForm
                    field="providerRemovalFrequency"
                    values={values.providerRemovalFrequency}
                    config={providerRemovalFrequencyConfig}
                    nameSpace="participantsAndProviders"
                    id="participants-and-providers-removal-frequency"
                    label={participantsAndProvidersT(
                      'providerRemovalFrequency.label'
                    )}
                    disabled={loading}
                  />

                  <FieldGroup className="margin-y-4 margin-bottom-8">
                    <Label htmlFor="participants-and-providers-provider-overlap">
                      {participantsAndProvidersT('providerOverlap.label')}
                    </Label>

                    {itSolutionsStarted && (
                      <ITSolutionsWarning
                        id="participants-and-providers-provider-overlap-warning"
                        onClick={() =>
                          history.push(
                            `/models/${modelID}/collaboration-area/task-list/it-solutions`
                          )
                        }
                      />
                    )}

                    <Fieldset>
                      {getKeys(providerOverlapConfig.options).map(key => (
                        <Fragment key={key}>
                          <Field
                            as={Radio}
                            id={`participants-and-providers-provider-overlap-${key}`}
                            name="providerOverlap"
                            label={providerOverlapConfig.options[key]}
                            value={key}
                            checked={values.providerOverlap === key}
                          />
                        </Fragment>
                      ))}
                    </Fieldset>

                    {(values.providerOverlap ===
                      OverlapType.YES_NEED_POLICIES ||
                      values.providerOverlap === OverlapType.YES_NO_ISSUES) && (
                      <FieldGroup>
                        <Label
                          htmlFor="participants-and-providers-provider-overlap-hierarchy"
                          className="text-normal margin-top-4"
                        >
                          {participantsAndProvidersT(
                            'providerOverlapHierarchy.label'
                          )}
                        </Label>

                        <Field
                          as={TextAreaField}
                          className="height-15"
                          id="participants-and-providers-provider-overlap-hierarchy"
                          name="providerOverlapHierarchy"
                        />
                      </FieldGroup>
                    )}

                    <AddNote
                      id="participants-and-providers-provider-overlap-note"
                      field="providerOverlapNote"
                    />
                  </FieldGroup>

                  {!loading && values.status && (
                    <ReadyForReview
                      id="participants-and-providers-provider-status"
                      field="status"
                      sectionName={participantsAndProvidersMiscT('heading')}
                      status={values.status}
                      setFieldValue={setFieldValue}
                      readyForReviewBy={readyForReviewByUserAccount?.commonName}
                      readyForReviewDts={readyForReviewDts}
                    />
                  )}

                  <div className="margin-top-6 margin-bottom-3">
                    <Button
                      type="button"
                      className="usa-button usa-button--outline margin-bottom-1"
                      onClick={() => {
                        history.push(
                          `/models/${modelID}/collaboration-area/task-list/participants-and-providers/coordination`
                        );
                      }}
                    >
                      {miscellaneousT('back')}
                    </Button>

                    <Button type="submit" onClick={() => setErrors({})}>
                      {miscellaneousT('saveAndStartNext')}
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

      <PageNumber currentPage={5} totalPages={5} className="margin-y-6" />
    </>
  );
};

export default ProviderOptions;
