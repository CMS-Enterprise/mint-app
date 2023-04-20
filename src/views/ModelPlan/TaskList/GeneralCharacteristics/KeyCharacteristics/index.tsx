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
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import ITToolsWarning from 'components/ITToolsWarning';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import Alert from 'components/shared/Alert';
import AutoSave from 'components/shared/AutoSave';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import useScrollElement from 'hooks/useScrollElement';
import GetKeyCharacteristics from 'queries/GeneralCharacteristics/GetKeyCharacteristics';
import {
  GetKeyCharacteristics as GetKeyCharacteristicsType,
  GetKeyCharacteristics_modelPlan_generalCharacteristics as KeyCharacteristicsFormType,
  GetKeyCharacteristicsVariables
} from 'queries/GeneralCharacteristics/types/GetKeyCharacteristics';
import { UpdatePlanGeneralCharacteristicsVariables } from 'queries/GeneralCharacteristics/types/UpdatePlanGeneralCharacteristics';
import UpdatePlanGeneralCharacteristics from 'queries/GeneralCharacteristics/UpdatePlanGeneralCharacteristics';
import {
  AlternativePaymentModelType,
  KeyCharacteristic
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import {
  mapMultiSelectOptions,
  translateAlternativePaymentTypes,
  translateKeyCharacteristics
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

const KeyCharacteristics = () => {
  const { t } = useTranslation('generalCharacteristics');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<KeyCharacteristicsFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetKeyCharacteristicsType,
    GetKeyCharacteristicsVariables
  >(GetKeyCharacteristics, {
    variables: {
      id: modelID
    }
  });

  const modelName = data?.modelPlan?.modelName || '';

  const {
    id,
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
  } =
    data?.modelPlan?.generalCharacteristics ||
    ({} as KeyCharacteristicsFormType);

  const itSolutionsStarted: boolean = !!data?.modelPlan.operationalNeeds.find(
    need => need.modifiedDts
  );

  // If redirected from IT Tools, scrolls to the relevant question
  useScrollElement(!loading);

  const [update] = useMutation<UpdatePlanGeneralCharacteristicsVariables>(
    UpdatePlanGeneralCharacteristics
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
                data-testid="plan-characteristics-key-characteristics-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <FieldGroup
                  scrollElement="alternativePaymentModelTypes"
                  error={!!flatErrors.alternativePaymentModelTypes}
                  className="margin-y-4 margin-bottom-8"
                >
                  <legend className="usa-label maxw-none">
                    {t('modelAPM')}
                  </legend>
                  <Alert type="info" slim data-testid="mandatory-fields-alert">
                    <span className="mandatory-fields-alert__text">
                      {t('MIPSInfo')}
                    </span>
                  </Alert>

                  <FieldErrorMsg>
                    {flatErrors.alternativePaymentModelTypes}
                  </FieldErrorMsg>

                  <Fieldset>
                    {Object.keys(AlternativePaymentModelType)
                      .filter(x => x !== AlternativePaymentModelType.NOT_APM)
                      .map(type => {
                        return (
                          <Fragment key={type}>
                            <Field
                              as={CheckboxField}
                              id={`plan-characteristics-alternative-payment-${type}`}
                              name="alternativePaymentModelTypes"
                              label={translateAlternativePaymentTypes(type)}
                              value={type}
                              checked={values.alternativePaymentModelTypes.includes(
                                type as AlternativePaymentModelType
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
                      label={translateAlternativePaymentTypes(
                        AlternativePaymentModelType.NOT_APM
                      )}
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
                    {t('keyCharacteristics')}
                  </Label>
                  <FieldErrorMsg>{flatErrors.keyCharacteristics}</FieldErrorMsg>

                  <Field
                    as={MultiSelect}
                    id="plan-characteristics-key-characteristics"
                    name="keyCharacteristics"
                    ariaLabel="label-plan-characteristics-key-characteristics"
                    role="combobox"
                    options={mapMultiSelectOptions(
                      translateKeyCharacteristics,
                      KeyCharacteristic
                    )}
                    selectedLabel={t('selectedKeyCharacteristics')}
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
                      {t('specificQuestions')}
                    </Label>
                    <p className="margin-y-1 margin-top-3">
                      {t('pleaseDescribe')}
                    </p>
                    <FieldErrorMsg>
                      {flatErrors.keyCharacteristicsOther}
                    </FieldErrorMsg>
                    <Field
                      as={TextInput}
                      data-testid="plan-characteristics-key-other"
                      error={!!flatErrors.keyCharacteristicsOther}
                      id="plan-characteristics-key-other"
                      maxLength={50}
                      name="keyCharacteristicsOther"
                    />
                  </FieldGroup>
                )}

                {(values.keyCharacteristics.includes(
                  'PART_C' as KeyCharacteristic
                ) ||
                  values.keyCharacteristics.includes(
                    'PART_D' as KeyCharacteristic
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
                        {t('reviewPlanBids')}
                      </Label>
                      {itSolutionsStarted && (
                        <ITToolsWarning
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
                        {t('manageEnrollment')}
                      </Label>
                      {itSolutionsStarted && (
                        <ITToolsWarning
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
                        {t('updatedContract')}
                      </Label>
                      {itSolutionsStarted && (
                        <ITToolsWarning
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
                      <Fieldset>
                        <Field
                          as={Radio}
                          id="plan-characteristics-contact-updated"
                          name="planContractUpdated"
                          label={h('yes')}
                          value="TRUE"
                          checked={values.planContractUpdated === true}
                          onChange={() => {
                            setFieldValue('planContractUpdated', true);
                          }}
                        />
                        <Field
                          as={Radio}
                          id="plan-characteristics-contact-updated-no"
                          name="planContractUpdated"
                          label={h('no')}
                          value="FALSE"
                          checked={values.planContractUpdated === false}
                          onChange={() => {
                            setFieldValue('planContractUpdated', false);
                          }}
                        />
                      </Fieldset>
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
