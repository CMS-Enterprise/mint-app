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
  IconArrowBack,
  Label,
  Radio
} from '@trussworks/react-uswds';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import ITSolutionsWarning from 'components/ITSolutionsWarning';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import TextAreaField from 'components/shared/TextAreaField';
import useScrollElement from 'hooks/useScrollElement';
import GetCommunication from 'queries/ParticipantsAndProviders/GetCommunication';
import {
  GetCommunication as GetCommunicationType,
  GetCommunication_modelPlan_participantsAndProviders as CommunicationFormType,
  GetCommunicationVariables
} from 'queries/ParticipantsAndProviders/types/GetCommunication';
import { UpdatePlanParticipantsAndProvidersVariables } from 'queries/ParticipantsAndProviders/types/UpdatePlanParticipantsAndProviders';
import UpdatePlanParticipantsAndProviders from 'queries/ParticipantsAndProviders/UpdatePlanParticipantsAndProviders';
import {
  ParticipantCommunicationType,
  ParticipantRiskType
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import {
  sortOtherEnum,
  translateCommunicationType,
  translateRiskType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

export const Communication = () => {
  const { t } = useTranslation('participantsAndProviders');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<CommunicationFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetCommunicationType,
    GetCommunicationVariables
  >(GetCommunication, {
    variables: {
      id: modelID
    }
  });

  const {
    id,
    communicationMethod,
    communicationMethodOther,
    communicationNote,
    participantAssumeRisk,
    riskType,
    riskOther,
    riskNote,
    willRiskChange,
    willRiskChangeNote
  } =
    data?.modelPlan?.participantsAndProviders || ({} as CommunicationFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const itSolutionsStarted: boolean = !!data?.modelPlan.operationalNeeds.find(
    need => need.modifiedDts
  );

  // If redirected from IT Solutions, scrolls to the relevant question
  useScrollElement(!loading);

  const [update] = useMutation<UpdatePlanParticipantsAndProvidersVariables>(
    UpdatePlanParticipantsAndProviders
  );

  const handleFormSubmit = (
    redirect?: 'next' | 'back' | 'task-list' | string
  ) => {
    update({
      variables: {
        id,
        changes: dirtyInput(
          formikRef?.current?.initialValues,
          formikRef?.current?.values
        )
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (redirect === 'next') {
            history.push(
              `/models/${modelID}/task-list/participants-and-providers/coordination`
            );
          } else if (redirect === 'back') {
            history.push(
              `/models/${modelID}/task-list/participants-and-providers/participants-options`
            );
          } else if (redirect === 'task-list') {
            history.push(`/models/${modelID}/task-list`);
          } else if (redirect) {
            history.push(redirect);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const initialValues: CommunicationFormType = {
    __typename: 'PlanParticipantsAndProviders',
    id: id ?? '',
    communicationMethod: communicationMethod ?? [],
    communicationMethodOther: communicationMethodOther ?? '',
    communicationNote: communicationNote ?? '',
    participantAssumeRisk: participantAssumeRisk ?? null,
    riskType: riskType ?? null,
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
        {h('for')} {modelName}
      </p>
      <p className="margin-bottom-2 font-body-md line-height-sans-4">
        {h('helpText')}
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
                className="desktop:grid-col-6 margin-top-6"
                data-testid="participants-and-providers-communication-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={!!error || loading}>
                  <FieldGroup
                    scrollElement="communicationMethod"
                    error={!!flatErrors.communicationMethod}
                  >
                    <FieldArray
                      name="communicationMethod"
                      render={arrayHelpers => (
                        <>
                          <legend className="usa-label">
                            {t('participantCommunication')}
                          </legend>
                          {itSolutionsStarted && (
                            <ITSolutionsWarning
                              id="participants-and-providers-communication-method-warning"
                              onClick={() =>
                                handleFormSubmit(
                                  `/models/${modelID}/task-list/it-solutions`
                                )
                              }
                            />
                          )}
                          <FieldErrorMsg>
                            {flatErrors.communicationMethod}
                          </FieldErrorMsg>

                          {Object.keys(ParticipantCommunicationType)
                            .sort(sortOtherEnum)
                            .map(type => {
                              return (
                                <Fragment key={type}>
                                  <Field
                                    as={CheckboxField}
                                    id={`participants-and-providers-communication-method-${type}`}
                                    name="communicationMethod"
                                    label={translateCommunicationType(type)}
                                    value={type}
                                    checked={values?.communicationMethod.includes(
                                      type as ParticipantCommunicationType
                                    )}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                      if (e.target.checked) {
                                        arrayHelpers.push(e.target.value);
                                      } else {
                                        const idx = values.communicationMethod.indexOf(
                                          e.target
                                            .value as ParticipantCommunicationType
                                        );
                                        arrayHelpers.remove(idx);
                                      }
                                    }}
                                  />
                                  {type === 'OTHER' &&
                                    values.communicationMethod.includes(
                                      'OTHER' as ParticipantCommunicationType
                                    ) && (
                                      <div className="margin-left-4 margin-top-neg-3">
                                        <Label
                                          htmlFor="participants-and-providers-communication-method-other"
                                          className="text-normal"
                                        >
                                          {h('pleaseSpecify')}
                                        </Label>
                                        <FieldErrorMsg>
                                          {flatErrors.communicationMethodOther}
                                        </FieldErrorMsg>
                                        <Field
                                          as={TextAreaField}
                                          className="maxw-none mint-textarea"
                                          id="participants-and-providers-communication-method-other"
                                          maxLength={5000}
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
                        </>
                      )}
                    />
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="participantAssumeRisk"
                    error={!!flatErrors.participantAssumeRisk}
                    className="margin-y-4 margin-bottom-8"
                  >
                    <Label htmlFor="participants-and-providers-risk">
                      {t('assumeRisk')}
                    </Label>
                    <FieldErrorMsg>
                      {flatErrors.participantAssumeRisk}
                    </FieldErrorMsg>
                    <Fieldset>
                      <Field
                        as={Radio}
                        id="participants-and-providers-risk"
                        name="participantAssumeRisk"
                        label={h('yes')}
                        value="TRUE"
                        checked={values.participantAssumeRisk === true}
                        onChange={() => {
                          setFieldValue('participantAssumeRisk', true);
                        }}
                      />
                      <Field
                        as={Radio}
                        id="participants-and-providers-risk-no"
                        name="participantAssumeRisk"
                        label={h('no')}
                        value="FALSE"
                        checked={values.participantAssumeRisk === false}
                        onChange={() => {
                          setFieldValue('participantAssumeRisk', false);
                        }}
                      />
                    </Fieldset>

                    {values.participantAssumeRisk && (
                      <>
                        <Label
                          htmlFor="participants-and-providers-risk-type"
                          className="text-normal"
                        >
                          {t('riskType')}
                        </Label>
                        <FieldErrorMsg>{flatErrors.riskType}</FieldErrorMsg>
                        <Fieldset>
                          {Object.keys(ParticipantRiskType)
                            .sort(sortOtherEnum)
                            .map(key => (
                              <Fragment key={key}>
                                <Field
                                  as={Radio}
                                  id={`participants-and-providers-risk-type-${key}`}
                                  name="riskType"
                                  label={translateRiskType(key)}
                                  value={key}
                                  checked={values.riskType === key}
                                  onChange={() => {
                                    setFieldValue('riskType', key);
                                  }}
                                />
                                {key === 'OTHER' && values.riskType === key && (
                                  <div className="margin-left-4 margin-top-2">
                                    <Label
                                      htmlFor="participants-and-providers-risk-type-other"
                                      className="text-normal"
                                    >
                                      {h('pleaseSpecify')}
                                    </Label>
                                    <FieldErrorMsg>
                                      {flatErrors.riskOther}
                                    </FieldErrorMsg>
                                    <Field
                                      as={TextAreaField}
                                      className="maxw-none mint-textarea"
                                      id="participants-and-providers-risk-type-other"
                                      data-testid="participants-and-providers-risk-type-other"
                                      maxLength={5000}
                                      name="riskOther"
                                    />
                                  </div>
                                )}
                              </Fragment>
                            ))}
                        </Fieldset>
                      </>
                    )}
                    <AddNote
                      id="participants-and-providers-risk-note"
                      field="riskNote"
                    />
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="willRiskChange"
                    error={!!flatErrors.willRiskChange}
                    className="margin-y-4 margin-bottom-8"
                  >
                    <Label htmlFor="participants-and-providers-risk-change">
                      {t('changeRisk')}
                    </Label>
                    <FieldErrorMsg>{flatErrors.willRiskChange}</FieldErrorMsg>
                    <Fieldset>
                      <Field
                        as={Radio}
                        id="participants-and-providers-risk-change"
                        name="willRiskChange"
                        label={h('yes')}
                        value="TRUE"
                        checked={values.willRiskChange === true}
                        onChange={() => {
                          setFieldValue('willRiskChange', true);
                        }}
                      />
                      <Field
                        as={Radio}
                        id="participants-and-providers-risk-change-no"
                        name="willRiskChange"
                        label={h('no')}
                        value="FALSE"
                        checked={values.willRiskChange === false}
                        onChange={() => {
                          setFieldValue('willRiskChange', false);
                        }}
                      />
                    </Fieldset>
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
                        handleFormSubmit('back');
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
                    onClick={() => handleFormSubmit('task-list')}
                  >
                    <IconArrowBack className="margin-right-1" aria-hidden />
                    {h('saveAndReturn')}
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
      <PageNumber currentPage={4} totalPages={5} className="margin-y-6" />
    </>
  );
};

export default Communication;
