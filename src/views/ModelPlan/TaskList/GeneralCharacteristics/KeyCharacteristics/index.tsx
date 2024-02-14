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
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  AgencyOrStateHelpType,
  AlternativePaymentModelType,
  GetKeyCharacteristicsQuery,
  KeyCharacteristic,
  useGetKeyCharacteristicsQuery,
  useUpdatePlanGeneralCharacteristicsMutation
} from 'gql/gen/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import ITSolutionsWarning from 'components/ITSolutionsWarning';
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
import usePlanTranslation from 'hooks/usePlanTranslation';
import useScrollElement from 'hooks/useScrollElement';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import { composeMultiSelectOptions } from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

type KeyCharacteristicsFormType = GetKeyCharacteristicsQuery['modelPlan']['generalCharacteristics'];

const KeyCharacteristics = () => {
  const { t: generalCharacteristicsT } = useTranslation(
    'generalCharacteristics'
  );
  const { t: generalCharacteristicsMiscT } = useTranslation(
    'generalCharacteristicsMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    agencyOrStateHelp: agencyOrStateHelpConfig,
    alternativePaymentModelTypes: alternativePaymentModelTypesConfig,
    keyCharacteristics: keyCharacteristicsConfig,
    collectPlanBids: collectPlanBidsConfig,
    managePartCDEnrollment: managePartCDEnrollmentConfig,
    planContractUpdated: planContractUpdatedConfig
  } = usePlanTranslation('generalCharacteristics');

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<KeyCharacteristicsFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useGetKeyCharacteristicsQuery({
    variables: {
      id: modelID
    }
  });

  const modelName = data?.modelPlan?.modelName || '';

  const {
    id,
    agencyOrStateHelp,
    agencyOrStateHelpOther,
    agencyOrStateHelpNote,
    alternativePaymentModelTypes,
    alternativePaymentModelNote,
    keyCharacteristics,
    keyCharacteristicsNote,
    keyCharacteristicsOther,
    collectPlanBids,
    collectPlanBidsNote,
    managePartCDEnrollment,
    managePartCDEnrollmentNote,
    planContractUpdated,
    planContractUpdatedNote
  } = (data?.modelPlan?.generalCharacteristics ||
    {}) as KeyCharacteristicsFormType;

  const itSolutionsStarted: boolean = !!data?.modelPlan.operationalNeeds.find(
    need => need.modifiedDts
  );

  // If redirected from Operational Solutions, scrolls to the relevant question
  useScrollElement(!loading);

  const [update] = useUpdatePlanGeneralCharacteristicsMutation();

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
              `/models/${modelID}/task-list/characteristics/involvements`
            );
          } else if (redirect === 'back') {
            history.push(`/models/${modelID}/task-list/characteristics`);
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

  const initialValues: KeyCharacteristicsFormType = {
    __typename: 'PlanGeneralCharacteristics',
    id: id ?? '',
    agencyOrStateHelp: agencyOrStateHelp ?? [],
    agencyOrStateHelpOther: agencyOrStateHelpOther ?? '',
    agencyOrStateHelpNote: agencyOrStateHelpNote ?? '',
    alternativePaymentModelTypes: alternativePaymentModelTypes ?? [],
    alternativePaymentModelNote: alternativePaymentModelNote ?? '',
    keyCharacteristics: keyCharacteristics ?? [],
    keyCharacteristicsOther: keyCharacteristicsOther ?? '',
    keyCharacteristicsNote: keyCharacteristicsNote ?? '',
    collectPlanBids: collectPlanBids ?? null,
    collectPlanBidsNote: collectPlanBidsNote ?? '',
    managePartCDEnrollment: managePartCDEnrollment ?? null,
    managePartCDEnrollmentNote: managePartCDEnrollmentNote ?? '',
    planContractUpdated: planContractUpdated ?? null,
    planContractUpdatedNote: planContractUpdatedNote ?? ''
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
          {generalCharacteristicsMiscT('breadcrumb')}
        </Breadcrumb>
      </BreadcrumbBar>
      <PageHeading className="margin-top-4 margin-bottom-2">
        {generalCharacteristicsMiscT('heading')}
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
        {(formikProps: FormikProps<KeyCharacteristicsFormType>) => {
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
                data-testid="plan-characteristics-key-characteristics-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={!!error || loading}>
                  <FieldGroup>
                    <Label htmlFor="plan-characteristics-agency-or-state-help">
                      {generalCharacteristicsT('agencyOrStateHelp.label')}
                    </Label>

                    <FieldErrorMsg>
                      {flatErrors.agencyOrStateHelp}
                    </FieldErrorMsg>

                    {getKeys(agencyOrStateHelpConfig.options).map(type => {
                      return (
                        <Fragment key={type}>
                          <Field
                            as={CheckboxField}
                            id={`plan-characteristics-agency-or-state-help-${type}`}
                            name="agencyOrStateHelp"
                            label={agencyOrStateHelpConfig.options[type]}
                            value={type}
                            checked={values?.agencyOrStateHelp.includes(type)}
                          />

                          {type === AgencyOrStateHelpType.OTHER &&
                            values.agencyOrStateHelp.includes(
                              AgencyOrStateHelpType.OTHER
                            ) && (
                              <div className="margin-left-4">
                                <Label
                                  htmlFor="plan-characteristics-agency-or-state-help-other"
                                  className="text-normal"
                                >
                                  {generalCharacteristicsT(
                                    'agencyOrStateHelpOther.label'
                                  )}
                                </Label>

                                <FieldErrorMsg>
                                  {flatErrors.agencyOrStateHelpOther}
                                </FieldErrorMsg>

                                <Field
                                  as={TextAreaField}
                                  className="maxw-none mint-textarea"
                                  id="plan-characteristics-agency-or-state-help-other"
                                  maxLength={5000}
                                  name="agencyOrStateHelpOther"
                                />
                              </div>
                            )}
                        </Fragment>
                      );
                    })}

                    <AddNote
                      id="plan-characteristics-agency-or-state-help-note"
                      field="agencyOrStateHelpNote"
                    />
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="alternativePaymentModelTypes"
                    error={!!flatErrors.alternativePaymentModelTypes}
                    className="margin-y-4 margin-bottom-8"
                  >
                    <legend className="usa-label maxw-none">
                      {generalCharacteristicsT(
                        'alternativePaymentModelTypes.label'
                      )}
                    </legend>

                    <Alert
                      type="info"
                      slim
                      data-testid="mandatory-fields-alert"
                    >
                      <span className="mandatory-fields-alert__text">
                        {generalCharacteristicsT(
                          'alternativePaymentModelTypes.sublabel'
                        )}
                      </span>
                    </Alert>

                    <FieldErrorMsg>
                      {flatErrors.alternativePaymentModelTypes}
                    </FieldErrorMsg>

                    <Fieldset>
                      {getKeys(alternativePaymentModelTypesConfig.options)
                        .filter(x => x !== AlternativePaymentModelType.NOT_APM)
                        .map(type => {
                          return (
                            <Fragment key={type}>
                              <Field
                                as={CheckboxField}
                                id={`plan-characteristics-alternative-payment-${type}`}
                                name="alternativePaymentModelTypes"
                                label={
                                  alternativePaymentModelTypesConfig.options[
                                    type
                                  ]
                                }
                                value={type}
                                checked={values.alternativePaymentModelTypes.includes(
                                  type
                                )}
                                disabled={values.alternativePaymentModelTypes.includes(
                                  AlternativePaymentModelType.NOT_APM
                                )}
                              />
                            </Fragment>
                          );
                        })}

                      <Field
                        as={CheckboxField}
                        id={`plan-characteristics-alternative-payment-${AlternativePaymentModelType.NOT_APM}`}
                        name="alternativePaymentModelTypes"
                        label={
                          alternativePaymentModelTypesConfig.options[
                            AlternativePaymentModelType.NOT_APM
                          ]
                        }
                        value={AlternativePaymentModelType.NOT_APM}
                        checked={values.alternativePaymentModelTypes.includes(
                          AlternativePaymentModelType.NOT_APM
                        )}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          if (e.target.checked) {
                            setFieldValue(
                              'alternativePaymentModelTypes',
                              AlternativePaymentModelType.NOT_APM
                            );
                          } else {
                            setFieldValue('alternativePaymentModelTypes', []);
                          }
                        }}
                      />
                    </Fieldset>

                    <AddNote
                      id="plan-characteristics-alternative-payment-note"
                      field="alternativePaymentModelNote"
                    />
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="keyCharacteristics"
                    error={!!flatErrors.keyCharacteristics}
                    className="margin-top-4"
                  >
                    <Label
                      htmlFor="plan-characteristics-key-characteristics"
                      id="label-plan-characteristics-key-characteristics"
                    >
                      {generalCharacteristicsT('keyCharacteristics.label')}
                    </Label>

                    <FieldErrorMsg>
                      {flatErrors.keyCharacteristics}
                    </FieldErrorMsg>

                    <Field
                      as={MultiSelect}
                      id="plan-characteristics-key-characteristics"
                      name="keyCharacteristics"
                      ariaLabel="label-plan-characteristics-key-characteristics"
                      role="combobox"
                      options={composeMultiSelectOptions(
                        keyCharacteristicsConfig.options
                      )}
                      selectedLabel={generalCharacteristicsT(
                        'keyCharacteristics.multiSelectLabel'
                      )}
                      onChange={(value: string[] | []) => {
                        setFieldValue('keyCharacteristics', value);
                      }}
                      initialValues={initialValues.keyCharacteristics}
                    />
                  </FieldGroup>

                  <AddNote
                    id="plan-characteristics-key-characteristics-note"
                    field="keyCharacteristicsNote"
                  />

                  {values.keyCharacteristics.includes(
                    KeyCharacteristic.OTHER
                  ) && (
                    <FieldGroup
                      scrollElement="keyCharacteristicsOther"
                      className="margin-top-neg-4"
                      error={!!flatErrors.keyCharacteristicsOther}
                    >
                      <Label htmlFor="plan-characteristics-key-other">
                        {generalCharacteristicsMiscT('specificQuestions')}
                      </Label>

                      <p className="margin-y-1 margin-top-3">
                        {generalCharacteristicsT(
                          'keyCharacteristicsOther.label'
                        )}
                      </p>

                      <FieldErrorMsg>
                        {flatErrors.keyCharacteristicsOther}
                      </FieldErrorMsg>

                      <Field
                        as={TextInput}
                        data-testid="plan-characteristics-key-other"
                        id="plan-characteristics-key-other"
                        maxLength={50}
                        name="keyCharacteristicsOther"
                      />
                    </FieldGroup>
                  )}

                  {(values.keyCharacteristics.includes(
                    KeyCharacteristic.PART_C
                  ) ||
                    values.keyCharacteristics.includes(
                      KeyCharacteristic.PART_D
                    )) && (
                    <>
                      <FieldGroup
                        scrollElement="collectPlanBids"
                        error={!!flatErrors.collectPlanBids}
                        className="margin-y-4"
                      >
                        <Label
                          htmlFor="plan-characteristics-collect-bids"
                          className="text-normal"
                        >
                          {generalCharacteristicsT('collectPlanBids.label')}
                        </Label>

                        {itSolutionsStarted && (
                          <ITSolutionsWarning
                            id="plan-characteristics-collect-bids-warning"
                            onClick={() =>
                              handleFormSubmit(
                                `/models/${modelID}/task-list/it-solutions`
                              )
                            }
                          />
                        )}

                        <FieldErrorMsg>
                          {flatErrors.collectPlanBids}
                        </FieldErrorMsg>

                        <BooleanRadio
                          field="collectPlanBids"
                          id="plan-characteristics-collect-bids"
                          value={values.collectPlanBids}
                          setFieldValue={setFieldValue}
                          options={collectPlanBidsConfig.options}
                        />
                      </FieldGroup>

                      <AddNote
                        id="plan-characteristics-collect-bids-note"
                        field="collectPlanBidsNote"
                        className="margin-bottom-0"
                      />

                      <FieldGroup
                        scrollElement="managePartCDEnrollment"
                        error={!!flatErrors.managePartCDEnrollment}
                        className="margin-y-4"
                      >
                        <Label
                          htmlFor="plan-characteristics-manage-enrollment"
                          className="text-normal"
                        >
                          {generalCharacteristicsT(
                            'managePartCDEnrollment.label'
                          )}
                        </Label>

                        {itSolutionsStarted && (
                          <ITSolutionsWarning
                            id="plan-characteristics-manage-enrollment-warning"
                            onClick={() =>
                              handleFormSubmit(
                                `/models/${modelID}/task-list/it-solutions`
                              )
                            }
                          />
                        )}

                        <FieldErrorMsg>
                          {flatErrors.managePartCDEnrollment}
                        </FieldErrorMsg>

                        <BooleanRadio
                          field="managePartCDEnrollment"
                          id="plan-characteristics-manage-enrollment"
                          value={values.managePartCDEnrollment}
                          setFieldValue={setFieldValue}
                          options={managePartCDEnrollmentConfig.options}
                        />
                      </FieldGroup>

                      <AddNote
                        id="plan-characteristics-manage-enrollment-note"
                        field="managePartCDEnrollmentNote"
                        className="margin-bottom-0"
                      />

                      <FieldGroup
                        scrollElement="planContractUpdated"
                        error={!!flatErrors.planContractUpdated}
                        className="margin-y-4"
                      >
                        <Label
                          htmlFor="plan-characteristics-contact-updated"
                          className="text-normal"
                        >
                          {generalCharacteristicsT('planContractUpdated.label')}
                        </Label>

                        {itSolutionsStarted && (
                          <ITSolutionsWarning
                            id="plan-characteristics-contact-updated-warning"
                            onClick={() =>
                              handleFormSubmit(
                                `/models/${modelID}/task-list/it-solutions`
                              )
                            }
                          />
                        )}

                        <FieldErrorMsg>
                          {flatErrors.planContractUpdated}
                        </FieldErrorMsg>

                        <BooleanRadio
                          field="planContractUpdated"
                          id="plan-characteristics-contact-updated"
                          value={values.planContractUpdated}
                          setFieldValue={setFieldValue}
                          options={planContractUpdatedConfig.options}
                        />
                      </FieldGroup>

                      <AddNote
                        id="plan-characteristics-contact-updated-note"
                        field="planContractUpdatedNote"
                      />
                    </>
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
                      {miscellaneousT('next')}
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

      <PageNumber currentPage={2} totalPages={5} className="margin-y-6" />
    </>
  );
};

export default KeyCharacteristics;
