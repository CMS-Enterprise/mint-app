import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Fieldset,
  Icon,
  Label,
  Radio
} from '@trussworks/react-uswds';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';
import {
  FrequencyType,
  GetProviderOptionsQuery,
  OverlapType,
  ProviderAddType,
  ProviderLeaveType,
  useGetProviderOptionsQuery,
  useUpdatePlanParticipantsAndProvidersMutation
} from 'gql/gen/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import ITSolutionsWarning from 'components/ITSolutionsWarning';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import ReadyForReview from 'components/ReadyForReview';
import AutoSave from 'components/shared/AutoSave';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import TextAreaField from 'components/shared/TextAreaField';
import usePlanTranslation from 'hooks/usePlanTranslation';
import useScrollElement from 'hooks/useScrollElement';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import { composeMultiSelectOptions } from 'utils/modelPlan';
import sanitizeStatus from 'utils/status';
import { NotFoundPartial } from 'views/NotFound';

type ProviderOptionsFormType = GetProviderOptionsQuery['modelPlan']['participantsAndProviders'];

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
    providerAdditionFrequencyOther,
    providerAdditionFrequencyNote,
    providerAddMethod,
    providerAddMethodOther,
    providerAddMethodNote,
    providerLeaveMethod,
    providerLeaveMethodOther,
    providerLeaveMethodNote,
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

  const [update] = useUpdatePlanParticipantsAndProvidersMutation();

  const handleFormSubmit = (
    redirect?: 'back' | 'task-list' | 'next' | string
  ) => {
    const dirtyInputs = dirtyInput(
      formikRef?.current?.initialValues,
      formikRef?.current?.values
    );

    if (dirtyInputs.status) {
      dirtyInputs.status = sanitizeStatus(dirtyInputs.status);
    }

    update({
      variables: {
        id,
        changes: dirtyInputs
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (redirect === 'back') {
            history.push(
              `/models/${modelID}/task-list/participants-and-providers/coordination`
            );
          } else if (redirect === 'task-list') {
            history.push(`/models/${modelID}/task-list`);
          } else if (redirect === 'next') {
            history.push(`/models/${modelID}/task-list/beneficiaries`);
          } else if (redirect) {
            history.push(redirect);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const initialValues: InitialValueType = {
    __typename: 'PlanParticipantsAndProviders',
    id: id ?? '',
    providerAdditionFrequency: providerAdditionFrequency ?? null,
    providerAdditionFrequencyOther: providerAdditionFrequencyOther ?? '',
    providerAdditionFrequencyNote: providerAdditionFrequencyNote ?? '',
    providerAddMethod: providerAddMethod ?? [],
    providerAddMethodOther: providerAddMethodOther ?? '',
    providerAddMethodNote: providerAddMethodNote ?? '',
    providerLeaveMethod: providerLeaveMethod ?? [],
    providerLeaveMethodOther: providerLeaveMethodOther ?? '',
    providerLeaveMethodNote: providerLeaveMethodNote ?? '',
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
      <BreadcrumbBar variant="wrap">
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to="/">
            <span>{miscellaneousT('home')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to={`/models/${modelID}/task-list/`}>
            <span>{miscellaneousT('tasklistBreadcrumb')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>
          {participantsAndProvidersMiscT('breadcrumb')}
        </Breadcrumb>
      </BreadcrumbBar>
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
          handleFormSubmit('next');
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<InitialValueType>) => {
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
              <Form
                className="desktop:grid-col-6 margin-top-6"
                data-testid="participants-and-providers-providers-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={!!error || loading}>
                  <FieldGroup
                    scrollElement="providerAdditionFrequency"
                    error={!!flatErrors.providerAdditionFrequency}
                    className="margin-bottom-8"
                  >
                    <Label htmlFor="participants-and-providers-additional-frequency">
                      {participantsAndProvidersT(
                        'providerAdditionFrequency.label'
                      )}
                    </Label>

                    <FieldErrorMsg>
                      {flatErrors.providerAdditionFrequency}
                    </FieldErrorMsg>

                    <Fieldset>
                      {getKeys(providerAdditionFrequencyConfig.options).map(
                        key => (
                          <Fragment key={key}>
                            <Field
                              as={Radio}
                              id={`participants-and-providers-additional-frequency-${key}`}
                              name="providerAdditionFrequency"
                              label={
                                providerAdditionFrequencyConfig.options[key]
                              }
                              value={key}
                              checked={values.providerAdditionFrequency === key}
                              onChange={() => {
                                setFieldValue('providerAdditionFrequency', key);
                              }}
                            />

                            {key === FrequencyType.OTHER &&
                              values.providerAdditionFrequency === key && (
                                <div className="margin-left-4 margin-top-1">
                                  <Label
                                    htmlFor="participants-and-providers-additional-frequency-other"
                                    className="text-normal"
                                  >
                                    {participantsAndProvidersT(
                                      'providerAdditionFrequencyOther.label'
                                    )}
                                  </Label>

                                  <FieldErrorMsg>
                                    {flatErrors.providerAdditionFrequencyOther}
                                  </FieldErrorMsg>

                                  <Field
                                    as={TextAreaField}
                                    className="maxw-none mint-textarea"
                                    id="participants-and-providers-additional-frequency-other"
                                    maxLength={5000}
                                    name="providerAdditionFrequencyOther"
                                  />
                                </div>
                              )}
                          </Fragment>
                        )
                      )}
                    </Fieldset>

                    <AddNote
                      id="participants-and-providers-additional-frequency-note"
                      field="providerAdditionFrequencyNote"
                    />
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="providerAddMethod"
                    error={!!flatErrors.providerAddMethod}
                    className="margin-top-4"
                  >
                    <Label
                      htmlFor="participants-and-providers-provider-add-method"
                      id="label-participants-and-providers-provider-add-method"
                    >
                      {participantsAndProvidersT('providerAddMethod.label')}
                    </Label>

                    <p className="text-base margin-top-1 margin-bottom-0 line-height-body-3">
                      {participantsAndProvidersT('providerAddMethod.sublabel')}
                    </p>

                    <FieldErrorMsg>
                      {flatErrors.providerAddMethod}
                    </FieldErrorMsg>

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
                      <FieldGroup
                        scrollElement="providerAddMethodOther"
                        error={!!flatErrors.providerAddMethodOther}
                      >
                        <Label
                          htmlFor="participants-and-providers-provider-add-method-other"
                          className="text-normal"
                        >
                          {participantsAndProvidersT(
                            'providerAddMethodOther.label'
                          )}
                        </Label>

                        <FieldErrorMsg>
                          {flatErrors.providerAddMethodOther}
                        </FieldErrorMsg>

                        <Field
                          as={TextAreaField}
                          className="height-15"
                          error={flatErrors.providerAddMethodOther}
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

                  <FieldGroup
                    scrollElement="providerLeaveMethod"
                    error={!!flatErrors.providerLeaveMethod}
                    className="margin-top-4"
                  >
                    <FieldArray
                      name="providerLeaveMethod"
                      render={arrayHelpers => (
                        <>
                          <legend className="usa-label">
                            {participantsAndProvidersT(
                              'providerLeaveMethod.label'
                            )}
                          </legend>

                          <p className="text-base margin-top-1 margin-bottom-0 line-height-body-3">
                            {participantsAndProvidersT(
                              'providerLeaveMethod.sublabel'
                            )}
                          </p>

                          <FieldErrorMsg>
                            {flatErrors.providerLeaveMethod}
                          </FieldErrorMsg>

                          {getKeys(providerLeaveMethodConfig.options).map(
                            type => {
                              return (
                                <Fragment key={type}>
                                  <Field
                                    as={CheckboxField}
                                    id={`participants-and-providers-leave-method-${type}`}
                                    name="providerLeaveMethod"
                                    label={
                                      providerLeaveMethodConfig.options[type]
                                    }
                                    value={type}
                                    checked={values?.providerLeaveMethod.includes(
                                      type
                                    )}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                      if (e.target.checked) {
                                        arrayHelpers.push(e.target.value);
                                      } else {
                                        const idx = values.providerLeaveMethod.indexOf(
                                          e.target.value as ProviderLeaveType
                                        );
                                        arrayHelpers.remove(idx);
                                      }
                                    }}
                                  />

                                  {type === ProviderLeaveType.OTHER &&
                                    values.providerLeaveMethod.includes(
                                      type
                                    ) && (
                                      <div className="margin-left-4 margin-top-neg-3">
                                        <Label
                                          htmlFor="participants-and-providers-leave-method-other"
                                          className="text-normal"
                                        >
                                          {participantsAndProvidersT(
                                            'providerLeaveMethodOther.label'
                                          )}
                                        </Label>

                                        <FieldErrorMsg>
                                          {flatErrors.providerLeaveMethodOther}
                                        </FieldErrorMsg>

                                        <Field
                                          as={TextAreaField}
                                          className="maxw-none mint-textarea"
                                          id="participants-and-providers-leave-method-other"
                                          maxLength={5000}
                                          name="providerLeaveMethodOther"
                                        />
                                      </div>
                                    )}
                                </Fragment>
                              );
                            }
                          )}
                          <AddNote
                            id="participants-and-providers-leave-method-note"
                            field="providerLeaveMethodNote"
                          />
                        </>
                      )}
                    />
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="providerOverlap"
                    error={!!flatErrors.providerOverlap}
                    className="margin-y-4 margin-bottom-8"
                  >
                    <Label htmlFor="participants-and-providers-provider-overlap">
                      {participantsAndProvidersT('providerOverlap.label')}
                    </Label>

                    {itSolutionsStarted && (
                      <ITSolutionsWarning
                        id="participants-and-providers-provider-overlap-warning"
                        onClick={() =>
                          handleFormSubmit(
                            `/models/${modelID}/task-list/it-solutions`
                          )
                        }
                      />
                    )}

                    <FieldErrorMsg>{flatErrors.providerOverlap}</FieldErrorMsg>

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
                            onChange={() => {
                              setFieldValue('providerOverlap', key);
                            }}
                          />
                        </Fragment>
                      ))}
                    </Fieldset>

                    {(values.providerOverlap ===
                      OverlapType.YES_NEED_POLICIES ||
                      values.providerOverlap === OverlapType.YES_NO_ISSUES) && (
                      <FieldGroup
                        scrollElement="providerOverlapHierarchy"
                        error={!!flatErrors.providerOverlapHierarchy}
                      >
                        <Label
                          htmlFor="participants-and-providers-provider-overlap-hierarchy"
                          className="text-normal margin-top-4"
                        >
                          {participantsAndProvidersT(
                            'providerOverlapHierarchy.label'
                          )}
                        </Label>

                        <FieldErrorMsg>
                          {flatErrors.providerOverlapHierarchy}
                        </FieldErrorMsg>

                        <Field
                          as={TextAreaField}
                          className="height-15"
                          error={flatErrors.providerOverlapHierarchy}
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
                        handleFormSubmit('back');
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
                    onClick={() => handleFormSubmit('task-list')}
                  >
                    <Icon.ArrowBack className="margin-right-1" aria-hidden />

                    {miscellaneousT('saveAndReturn')}
                  </Button>
                </Fieldset>
              </Form>

              {id && (
                <AutoSave
                  values={values}
                  onSave={() => {
                    handleFormSubmit();
                  }}
                  debounceDelay={3000}
                />
              )}
            </>
          );
        }}
      </Formik>

      <PageNumber currentPage={5} totalPages={5} className="margin-y-6" />
    </>
  );
};

export default ProviderOptions;
