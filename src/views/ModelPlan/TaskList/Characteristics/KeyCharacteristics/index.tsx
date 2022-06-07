import React, { Fragment, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Fieldset,
  IconAdd,
  IconArrowBack,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';

import AskAQuestion from 'components/AskAQuestion';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import Alert from 'components/shared/Alert';
import AutoSave from 'components/shared/AutoSave';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import TextAreaField from 'components/shared/TextAreaField';
import GetModelPlanCharacteristics from 'queries/GetModelPlanCharacteristics';
import {
  GetModelPlanCharacteristics as GetModelPlanCharacteristicsType,
  GetModelPlanCharacteristics_modelPlan_generalCharacteristics as ModelPlanCharacteristicsFormType
} from 'queries/types/GetModelPlanCharacteristics';
import { UpdateModelPlanCharacteristicsVariables } from 'queries/types/UpdateModelPlanCharacteristics';
import UpdateModelPlanCharacteristics from 'queries/UpdateModelPlanCharacteristics';
import {
  AlternativePaymentModelType,
  KeyCharacteristic
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import {
  translateAlternativePaymentTypes,
  translateKeyCharacteristics
} from 'utils/modelPlan';

const KeyCharacteristics = () => {
  const { t } = useTranslation('generalCharacteristics');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<ModelPlanCharacteristicsFormType>>(null);
  const history = useHistory();
  const [alternativePaymentNote, setAlternativePaymentNote] = useState(false);
  // const [keyCharacteristicsNote, setkeyCharacteristicsNote] = useState(false);  // TODO: BE needs to implement this field
  const [isCollectPlanBidsNote, setIsCollectPlanBidsNote] = useState(false);
  const [
    isManagePartCDEnrollmentNote,
    setIsManagePartCDEnrollmentNote
  ] = useState(false);
  const [isPlanContactUpdatedNote, setIsPlanContactUpdatedNote] = useState(
    false
  );

  const { data } = useQuery<GetModelPlanCharacteristicsType>(
    GetModelPlanCharacteristics,
    {
      variables: {
        id: modelID
      }
    }
  );

  const modelName = data?.modelPlan?.modelName || '';

  const {
    id,
    alternativePaymentModel,
    alternativePaymentModelTypes,
    alternativePaymentModelNote,
    keyCharacteristics,
    // keyCharacteristicsNote, TODO: BE needs to implement this field
    keyCharacteristicsOther,
    collectPlanBids,
    collectPlanBidsNote,
    managePartCDEnrollment,
    managePartCDEnrollmentNote,
    planContactUpdated,
    planContactUpdatedNote
  } =
    data?.modelPlan?.generalCharacteristics ||
    ({} as ModelPlanCharacteristicsFormType);

  const [update] = useMutation<UpdateModelPlanCharacteristicsVariables>(
    UpdateModelPlanCharacteristics
  );

  const handleFormSubmit = (
    formikValues: ModelPlanCharacteristicsFormType,
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
              `/models/${modelID}/task-list/characteristics/involvements`
            );
          } else if (redirect === 'back') {
            history.push(`/models/${modelID}/task-list/characteristics`);
          } else if (redirect === 'task-list') {
            history.push(`/models/${modelID}/task-list`);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const mappedKeyCharacteristics = Object.keys(KeyCharacteristic)
    .map(key => ({
      value: key,
      label: translateKeyCharacteristics(key)
    }))
    .sort((a, b) => {
      if (a.label < b.label || b.label === 'Other') {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });

  const initialValues = {
    alternativePaymentModel: alternativePaymentModel ?? null,
    alternativePaymentModelTypes: alternativePaymentModelTypes ?? [],
    alternativePaymentModelNote: alternativePaymentModelNote ?? '',
    keyCharacteristics: keyCharacteristics ?? [],
    keyCharacteristicsOther: keyCharacteristicsOther ?? '',
    collectPlanBids: collectPlanBids ?? null,
    collectPlanBidsNote: collectPlanBidsNote ?? '',
    managePartCDEnrollment: managePartCDEnrollment ?? null,
    managePartCDEnrollmentNote: managePartCDEnrollmentNote ?? '',
    planContactUpdated: planContactUpdated ?? null,
    planContactUpdatedNote: planContactUpdatedNote ?? ''
  } as ModelPlanCharacteristicsFormType;

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
        // validationSchema={validationSchema}
        validateOnBlur={false}
        validateOnChange={false}
        validateOnMount={false}
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<ModelPlanCharacteristicsFormType>) => {
          const {
            dirty,
            errors,
            handleSubmit,
            setErrors,
            setFieldValue,
            validateForm,
            isValid,
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
                onSubmit={e => {
                  handleSubmit(e);
                  window.scrollTo(0, 0);
                }}
              >
                <FieldGroup
                  scrollElement="alternativePaymentModel"
                  error={!!flatErrors.alternativePaymentModel}
                  className="margin-y-4"
                >
                  <Label htmlFor="plan-characteristics-alternative-payment">
                    {t('modelAPM')}
                  </Label>
                  <p className="text-base margin-y-1">{t('forQPP')}</p>
                  <FieldErrorMsg>
                    {flatErrors.alternativePaymentModel}
                  </FieldErrorMsg>
                  <Fieldset>
                    <Field
                      as={Radio}
                      id="plan-characteristics-alternative-payment"
                      name="alternativePaymentModel"
                      label={h('yes')}
                      value="TRUE"
                      checked={values.alternativePaymentModel === true}
                      onChange={() => {
                        setFieldValue('alternativePaymentModel', true);
                      }}
                    />
                    <Field
                      as={Radio}
                      id="plan-characteristics-alternative-payment-no"
                      name="alternativePaymentModel"
                      label={h('no')}
                      value="FALSE"
                      checked={values.alternativePaymentModel === false}
                      onChange={() => {
                        setFieldValue('alternativePaymentModel', false);
                      }}
                    />
                  </Fieldset>
                </FieldGroup>

                <FieldArray
                  name="alternativePaymentModelTypes"
                  render={arrayHelpers => (
                    <>
                      <legend className="usa-label">{t('modelAPMType')}</legend>
                      <FieldErrorMsg>
                        {flatErrors.alternativePaymentModelTypes}
                      </FieldErrorMsg>

                      {Object.keys(AlternativePaymentModelType).map(type => {
                        return (
                          <Fragment key={type}>
                            <Field
                              as={CheckboxField}
                              id={`plan-characteristics-alternativePaymentModelTypes-${type}`}
                              name="alternativePaymentModelTypes"
                              label={translateAlternativePaymentTypes(type)}
                              value={type}
                              checked={values.alternativePaymentModelTypes.includes(
                                type as AlternativePaymentModelType
                              )}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                if (e.target.checked) {
                                  arrayHelpers.push(e.target.value);
                                } else {
                                  const idx = values.alternativePaymentModelTypes.indexOf(
                                    e.target
                                      .value as AlternativePaymentModelType
                                  );
                                  arrayHelpers.remove(idx);
                                }
                              }}
                            />
                            {type === 'MIPS' &&
                              values.alternativePaymentModelTypes.includes(
                                type as AlternativePaymentModelType
                              ) && (
                                <Alert
                                  type="info"
                                  slim
                                  data-testid="mandatory-fields-alert"
                                  className="margin-bottom-4 margin-left-4"
                                >
                                  <span className="mandatory-fields-alert__text">
                                    {t('MIPSInfo')}
                                  </span>
                                </Alert>
                              )}
                          </Fragment>
                        );
                      })}
                    </>
                  )}
                />

                <Button
                  type="button"
                  className="usa-button usa-button--unstyled margin-top-4"
                  onClick={() => setAlternativePaymentNote(true)}
                >
                  <IconAdd className="margin-right-1" aria-hidden />
                  {h('additionalNote')}
                </Button>

                {alternativePaymentNote && (
                  <FieldGroup className="margin-top-4">
                    <Field
                      as={TextAreaField}
                      className="height-15"
                      id="plan-characteristics-note"
                      name="alternativePaymentModelNote"
                      label={h('Notes')}
                    />
                  </FieldGroup>
                )}

                <FieldGroup
                  scrollElement="keyCharacteristics"
                  error={!!flatErrors.keyCharacteristics}
                  className="margin-top-4"
                >
                  <Label htmlFor="plan-characteristics-key-characteristics">
                    {t('modelResemblance')}
                  </Label>
                  <p className="text-base margin-y-1">{t('startTypeing')}</p>
                  <FieldErrorMsg>{flatErrors.keyCharacteristics}</FieldErrorMsg>

                  <Field
                    as={MultiSelect}
                    id="plan-characteristics-key-characteristics"
                    name="keyCharacteristics"
                    options={mappedKeyCharacteristics}
                    selectedLabel={t('selectedKeyCharacteristics')}
                    onChange={(value: string[] | []) => {
                      setFieldValue('keyCharacteristics', value);
                    }}
                    initialValues={initialValues.keyCharacteristics}
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="keyCharacteristicsOther"
                  error={!!flatErrors.keyCharacteristicsOther}
                >
                  <Label htmlFor="plan-characteristics-key-other">
                    {t('specificQuestions')}
                  </Label>
                  <p className="text-base margin-y-1 margin-top-3">
                    {t('pleaseDescribe')}
                  </p>
                  <FieldErrorMsg>
                    {flatErrors.keyCharacteristicsOther}
                  </FieldErrorMsg>
                  <Field
                    as={TextInput}
                    error={!!flatErrors.keyCharacteristicsOther}
                    id="plan-characteristics-key-other"
                    maxLength={50}
                    name="keyCharacteristicsOther"
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="collectPlanBids"
                  error={!!flatErrors.collectPlanBids}
                  className="margin-y-4"
                >
                  <Label htmlFor="plan-characteristics-collect-bids">
                    {t('reviewPlanBids')}
                  </Label>
                  <FieldErrorMsg>{flatErrors.collectPlanBids}</FieldErrorMsg>
                  <Fieldset>
                    <Field
                      as={Radio}
                      id="plan-characteristics-collect-bids"
                      name="collectPlanBids"
                      label={h('yes')}
                      value="TRUE"
                      checked={values.collectPlanBids === true}
                      onChange={() => {
                        setFieldValue('collectPlanBids', true);
                      }}
                    />
                    <Field
                      as={Radio}
                      id="plan-characteristics-collect-bids-no"
                      name="collectPlanBids"
                      label={h('no')}
                      value="FALSE"
                      checked={values.collectPlanBids === false}
                      onChange={() => {
                        setFieldValue('collectPlanBids', false);
                      }}
                    />
                  </Fieldset>
                </FieldGroup>

                <Button
                  type="button"
                  className="usa-button usa-button--unstyled"
                  onClick={() => setIsCollectPlanBidsNote(true)}
                >
                  <IconAdd className="margin-right-1" aria-hidden />
                  {h('additionalNote')}
                </Button>

                {isCollectPlanBidsNote && (
                  <FieldGroup className="margin-top-4">
                    <Field
                      as={TextAreaField}
                      className="height-15"
                      id="plan-characteristics-collect-bids-note"
                      name="collectPlanBidsNote"
                      label={h('Notes')}
                    />
                  </FieldGroup>
                )}

                <FieldGroup
                  scrollElement="managePartCDEnrollment"
                  error={!!flatErrors.managePartCDEnrollment}
                  className="margin-y-4"
                >
                  <Label htmlFor="plan-characteristics-manage-enrollment">
                    {t('manageEnrollment')}
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors.managePartCDEnrollment}
                  </FieldErrorMsg>
                  <Fieldset>
                    <Field
                      as={Radio}
                      id="plan-characteristics-manage-enrollment"
                      name="managePartCDEnrollment"
                      label={h('yes')}
                      value="TRUE"
                      checked={values.managePartCDEnrollment === true}
                      onChange={() => {
                        setFieldValue('managePartCDEnrollment', true);
                      }}
                    />
                    <Field
                      as={Radio}
                      id="plan-characteristics-manage-enrollment-no"
                      name="managePartCDEnrollment"
                      label={h('no')}
                      value="FALSE"
                      checked={values.managePartCDEnrollment === false}
                      onChange={() => {
                        setFieldValue('managePartCDEnrollment', false);
                      }}
                    />
                  </Fieldset>
                </FieldGroup>

                <Button
                  type="button"
                  className="usa-button usa-button--unstyled"
                  onClick={() => setIsManagePartCDEnrollmentNote(true)}
                >
                  <IconAdd className="margin-right-1" aria-hidden />
                  {h('additionalNote')}
                </Button>

                {isManagePartCDEnrollmentNote && (
                  <FieldGroup className="margin-top-4">
                    <Field
                      as={TextAreaField}
                      className="height-15"
                      id="plan-characteristics-manage-enrollment-note"
                      name="managePartCDEnrollmentNote"
                      label={h('Notes')}
                    />
                  </FieldGroup>
                )}

                <FieldGroup
                  scrollElement="planContactUpdated"
                  error={!!flatErrors.planContactUpdated}
                  className="margin-y-4"
                >
                  <Label htmlFor="plan-characteristics-contact-updated">
                    {t('updatedContact')}
                  </Label>
                  <FieldErrorMsg>{flatErrors.planContactUpdated}</FieldErrorMsg>
                  <Fieldset>
                    <Field
                      as={Radio}
                      id="plan-characteristics-contact-updated"
                      name="planContactUpdated"
                      label={h('yes')}
                      value="TRUE"
                      checked={values.planContactUpdated === true}
                      onChange={() => {
                        setFieldValue('planContactUpdated', true);
                      }}
                    />
                    <Field
                      as={Radio}
                      id="plan-characteristics-contact-updated-no"
                      name="planContactUpdated"
                      label={h('no')}
                      value="FALSE"
                      checked={values.planContactUpdated === false}
                      onChange={() => {
                        setFieldValue('planContactUpdated', false);
                      }}
                    />
                  </Fieldset>
                </FieldGroup>

                <Button
                  type="button"
                  className="usa-button usa-button--unstyled"
                  onClick={() => setIsPlanContactUpdatedNote(true)}
                >
                  <IconAdd className="margin-right-1" aria-hidden />
                  {h('additionalNote')}
                </Button>

                {isPlanContactUpdatedNote && (
                  <FieldGroup className="margin-top-4">
                    <Field
                      as={TextAreaField}
                      className="height-15"
                      id="plan-characteristics-contact-updated-note"
                      name="planContactUpdatedNote"
                      label={h('Notes')}
                    />
                  </FieldGroup>
                )}

                <div className="margin-top-6 margin-bottom-3">
                  <Button
                    type="button"
                    className="usa-button usa-button--outline margin-bottom-1"
                    onClick={() => {
                      if (Object.keys(errors).length > 0) {
                        window.scrollTo(0, 0);
                      } else {
                        validateForm().then(err => {
                          if (Object.keys(err).length > 0) {
                            window.scrollTo(0, 0);
                          } else {
                            handleFormSubmit(values, 'back');
                          }
                        });
                      }
                    }}
                  >
                    {h('back')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={!(dirty || isValid)}
                    onClick={() => setErrors({})}
                  >
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
      <PageNumber currentPage={2} totalPages={5} className="margin-y-6" />
    </>
  );
};

export default KeyCharacteristics;
