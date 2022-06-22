import React, { Fragment, useMemo, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, Route, Switch, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  ComboBox,
  Fieldset,
  Grid,
  GridContainer,
  IconArrowBack,
  IconVolumeOff,
  Label,
  Radio,
  RangeInput,
  TextInput
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import TextAreaField from 'components/shared/TextAreaField';
import GetModelPlanParticipantsAndProviders from 'queries/GetModelPlanParticipantsAndProviders';
import {
  GetModelPlanProvidersAndParticipants as GetModelPlanProvidersAndParticipantsType,
  GetModelPlanProvidersAndParticipants_modelPlan_providersAndParticipants as ModelPlanParticipantsAndProvidersFormType
} from 'queries/types/GetModelPlanProvidersAndParticipants';
import { UpdateModelPlanProvidersAndParticipantsVariables } from 'queries/types/UpdateModelPlanProvidersAndParticipants';
import UpdateModelPlanProvidersAndParticipants from 'queries/UpdateModelPlanProvidersAndParticipants';
import { ParticipantsIDType } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { sortOtherEnum, translateParticipantIDType } from 'utils/modelPlan';

export const Coordination = () => {
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
    coordinateWork,
    coordinateWorkNote,
    gainsharePayments,
    gainsharePaymentsTrack,
    gainsharePaymentsNote,
    participantsIds,
    participantsIdsOther,
    participantsIDSNote
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
              `/models/${modelID}/task-list/participants-and-providers/provider-options`
            );
          } else if (redirect === 'back') {
            history.push(
              `/models/${modelID}/task-list/participants-and-providers/communication`
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
    coordinateWork: coordinateWork ?? null,
    coordinateWorkNote: coordinateWorkNote ?? '',
    gainsharePayments: gainsharePayments ?? null,
    gainsharePaymentsTrack: gainsharePaymentsTrack || null,
    gainsharePaymentsNote: gainsharePaymentsNote ?? '',
    participantsIds: participantsIds ?? [],
    participantsIdsOther: participantsIdsOther || '',
    participantsIDSNote: participantsIDSNote ?? ''
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
                <FieldGroup
                  scrollElement="coordinateWork"
                  error={!!flatErrors.coordinateWork}
                  className="margin-y-4 margin-bottom-8"
                >
                  <Label htmlFor="participants-and-providers-coordniate-work">
                    {t('workCoordination')}
                  </Label>
                  <p className="text-base margin-0 line-height-body-3">
                    {t('workCoordinationNote')}
                  </p>
                  <FieldErrorMsg>{flatErrors.coordinateWork}</FieldErrorMsg>
                  <Fieldset>
                    <Field
                      as={Radio}
                      id="participants-and-providers-coordniate-work"
                      name="coordinateWork"
                      label={h('yes')}
                      value="TRUE"
                      checked={values.coordinateWork === true}
                      onChange={() => {
                        setFieldValue('coordinateWork', true);
                      }}
                    />
                    <Field
                      as={Radio}
                      id="participants-and-providers-coordniate-work-no"
                      name="coordinateWork"
                      label={h('no')}
                      value="FALSE"
                      checked={values.coordinateWork === false}
                      onChange={() => {
                        setFieldValue('coordinateWork', false);
                      }}
                    />
                  </Fieldset>
                  <AddNote
                    id="participants-and-providers-coordniate-work-note"
                    field="coordinateWorkeNote"
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="gainsharePayments"
                  error={!!flatErrors.gainsharePayments}
                  className="margin-y-4 margin-bottom-8"
                >
                  <Label htmlFor="participants-and-providers-gainshare-payment">
                    {t('gainsharing')}
                  </Label>
                  <FieldErrorMsg>{flatErrors.gainsharePayments}</FieldErrorMsg>
                  <Fieldset>
                    <Field
                      as={Radio}
                      id="participants-and-providers-gainshare-payment"
                      name="gainsharePayments"
                      label={h('yes')}
                      value="TRUE"
                      checked={values.gainsharePayments === true}
                      onChange={() => {
                        setFieldValue('gainsharePayments', true);
                      }}
                    />
                    <Field
                      as={Radio}
                      id="participants-and-providers-gainshare-payment-no"
                      name="gainsharePayments"
                      label={h('no')}
                      value="FALSE"
                      checked={values.gainsharePayments === false}
                      onChange={() => {
                        setFieldValue('gainsharePayments', false);
                      }}
                    />
                  </Fieldset>

                  {values.gainsharePayments && (
                    <>
                      <Label
                        htmlFor="participants-and-providers-gainshare-track"
                        className="text-normal"
                      >
                        {t('trackPayments')}
                      </Label>
                      <FieldErrorMsg>
                        {flatErrors.gainsharePaymentsTrack}
                      </FieldErrorMsg>
                      <Fieldset>
                        <Field
                          as={Radio}
                          id="participants-and-providers-gainshare-track"
                          name="gainsharePaymentsTrack"
                          label={h('yes')}
                          value="TRUE"
                          checked={values.gainsharePaymentsTrack === true}
                          onChange={() => {
                            setFieldValue('gainsharePaymentsTrack', true);
                          }}
                        />
                        <Field
                          as={Radio}
                          id="participants-and-providers-gainshare-track-no"
                          name="gainsharePaymentsTrack"
                          label={h('no')}
                          value="FALSE"
                          checked={values.gainsharePaymentsTrack === false}
                          onChange={() => {
                            setFieldValue('gainsharePaymentsTrack', false);
                          }}
                        />
                      </Fieldset>
                    </>
                  )}
                  <AddNote
                    id="participants-and-providers-gainshare-payment-note"
                    field="gainsharePaymentsNote"
                  />
                </FieldGroup>

                <FieldArray
                  name="participantsIds"
                  render={arrayHelpers => (
                    <>
                      <legend className="usa-label">{t('collectTINs')}</legend>
                      <p className="text-base margin-0 line-height-body-3">
                        {t('collectTINsInfo')}
                      </p>
                      <FieldErrorMsg>
                        {flatErrors.participantsIds}
                      </FieldErrorMsg>

                      {Object.keys(ParticipantsIDType)
                        .sort(sortOtherEnum)
                        .map(type => {
                          return (
                            <Fragment key={type}>
                              <Field
                                as={CheckboxField}
                                id={`participants-and-providers-participant-id-${type}`}
                                name="participantsIds"
                                label={translateParticipantIDType(type)}
                                value={type}
                                checked={values?.participantsIds.includes(
                                  type as ParticipantsIDType
                                )}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  if (e.target.checked) {
                                    arrayHelpers.push(e.target.value);
                                  } else {
                                    const idx = values.participantsIds.indexOf(
                                      e.target.value as ParticipantsIDType
                                    );
                                    arrayHelpers.remove(idx);
                                  }
                                }}
                              />
                              {type === 'OTHER' &&
                                values.participantsIds.includes(type) && (
                                  <div className="margin-left-4">
                                    <Label
                                      htmlFor="participants-and-providers-participant-id-other"
                                      className="text-normal margin-top-1"
                                    >
                                      {h('pleaseSpecify')}
                                    </Label>
                                    <FieldErrorMsg>
                                      {flatErrors.participantsIdsOther}
                                    </FieldErrorMsg>
                                    <Field
                                      as={TextInput}
                                      className="maxw-none"
                                      id="participants-and-providers-participant-id-other"
                                      maxLength={50}
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
                    </>
                  )}
                />

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

export default Coordination;
