import React, { Fragment, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
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
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import GetModelPlanParticipantsAndProviders from 'queries/GetModelPlanParticipantsAndProviders';
import {
  GetModelPlanProvidersAndParticipants as GetModelPlanProvidersAndParticipantsType,
  GetModelPlanProvidersAndParticipants_modelPlan_participantsAndProviders as ModelPlanParticipantsAndProvidersFormType
} from 'queries/types/GetModelPlanProvidersAndParticipants';
import { UpdateModelPlanProvidersAndParticipantsVariables } from 'queries/types/UpdateModelPlanProvidersAndParticipants';
import UpdateModelPlanProvidersAndParticipants from 'queries/UpdateModelPlanProvidersAndParticipants';
import {
  ParticipantCommunicationType,
  ParticipantRiskType
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import {
  sortOtherEnum,
  translateCommunicationType,
  translateRiskType
} from 'utils/modelPlan';

export const Communication = () => {
  const { t } = useTranslation('participantsAndProviders');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<
    FormikProps<ModelPlanParticipantsAndProvidersFormType>
  >(null);
  const history = useHistory();

  const { data } = useQuery<GetModelPlanProvidersAndParticipantsType>(
    GetModelPlanParticipantsAndProviders,
    {
      variables: {
        id: modelID
      }
    }
  );

  const {
    id,
    communicationMethod,
    communicationNote,
    participantAssumeRisk,
    riskType,
    riskOther,
    riskNote,
    willRiskChange,
    willRiskChangeNote
  } =
    data?.modelPlan?.participantsAndProviders ||
    ({} as ModelPlanParticipantsAndProvidersFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const [
    update
  ] = useMutation<UpdateModelPlanProvidersAndParticipantsVariables>(
    UpdateModelPlanProvidersAndParticipants
  );

  const handleFormSubmit = (
    formikValues: ModelPlanParticipantsAndProvidersFormType,
    redirect?: 'next' | 'back' | 'task-list'
  ) => {
    update({
      variables: {
        id,
        changes: formikValues
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
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const initialValues = {
    communicationMethod: communicationMethod ?? [],
    communicationNote: communicationNote ?? '',
    participantAssumeRisk: participantAssumeRisk ?? null,
    riskType: riskType || null,
    riskOther: riskOther ?? '',
    riskNote: riskNote ?? '',
    willRiskChange: willRiskChange || null,
    willRiskChangeNote: willRiskChangeNote ?? ''
  } as ModelPlanParticipantsAndProvidersFormType;

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
        <Trans i18nKey="modelPlanTaskList:subheading">
          indexZero {modelName} indexTwo
        </Trans>
      </p>
      <p className="margin-bottom-2 font-body-md line-height-sans-4">
        {h('helpText')}
      </p>

      <AskAQuestion modelID={modelID} />

      <Formik
        initialValues={initialValues}
        onSubmit={values => {
          handleFormSubmit(values, 'next');
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(
          formikProps: FormikProps<ModelPlanParticipantsAndProvidersFormType>
        ) => {
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
                className="tablet:grid-col-6 margin-top-6"
                data-testid="participants-and-providers-communication-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <FieldArray
                  name="communicationMethod"
                  render={arrayHelpers => (
                    <>
                      <legend className="usa-label">
                        {t('participantCommunication')}
                      </legend>
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
                                    as={TextInput}
                                    className="maxw-none"
                                    id="participants-and-providers-risk-type-other"
                                    data-testid="participants-and-providers-risk-type-other"
                                    maxLength={50}
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
                      handleFormSubmit(values, 'back');
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
                  onClick={() => handleFormSubmit(values, 'task-list')}
                >
                  <IconArrowBack className="margin-right-1" aria-hidden />
                  {h('saveAndReturn')}
                </Button>
              </Form>
              {id && (
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
      <PageNumber currentPage={4} totalPages={5} className="margin-y-6" />
    </>
  );
};

export default Communication;
