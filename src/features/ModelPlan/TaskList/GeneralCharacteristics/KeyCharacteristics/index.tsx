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
  AgencyOrStateHelpType,
  AlternativePaymentModelType,
  GetKeyCharacteristicsQuery,
  KeyCharacteristic,
  TypedUpdatePlanGeneralCharacteristicsDocument,
  useGetKeyCharacteristicsQuery
} from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import ITSolutionsWarning from 'components/ITSolutionsWarning';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import FieldGroup from 'components/FieldGroup';
import MultiSelect from 'components/MultiSelect';
import TextAreaField from 'components/TextAreaField';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import useScrollElement from 'hooks/useScrollElement';
import { getKeys } from 'types/translation';
import { composeMultiSelectOptions } from 'utils/modelPlan';
import { NotFoundPartial } from 'features/NotFound';

type KeyCharacteristicsFormType =
  GetKeyCharacteristicsQuery['modelPlan']['generalCharacteristics'];

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

  const { mutationError } = useHandleMutation(
    TypedUpdatePlanGeneralCharacteristicsDocument,
    {
      id,
      formikRef
    }
  );

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
          BreadcrumbItemOptions.GENERAL_CHARACTERISTICS
        ]}
      />

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
          history.push(
            `/models/${modelID}/collaboration-area/task-list/characteristics/involvements`
          );
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<KeyCharacteristicsFormType>) => {
          const { handleSubmit, setErrors, setFieldValue, values } =
            formikProps;

          return (
            <>
              <ConfirmLeave />

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

                  <FieldGroup className="margin-y-4 margin-bottom-8">
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

                  <FieldGroup className="margin-top-4">
                    <Label
                      htmlFor="plan-characteristics-key-characteristics"
                      id="label-plan-characteristics-key-characteristics"
                    >
                      {generalCharacteristicsT('keyCharacteristics.label')}
                    </Label>

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
                    <FieldGroup className="margin-top-neg-4">
                      <Label htmlFor="plan-characteristics-key-other">
                        {generalCharacteristicsMiscT('specificQuestions')}
                      </Label>

                      <p className="margin-y-1 margin-top-3">
                        {generalCharacteristicsT(
                          'keyCharacteristicsOther.label'
                        )}
                      </p>

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
                      <FieldGroup className="margin-y-4">
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
                              history.push(
                                `/models/${modelID}/collaboration-area/task-list/it-solutions`
                              )
                            }
                          />
                        )}

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
                              history.push(
                                `/models/${modelID}/collaboration-area/task-list/it-solutions`
                              )
                            }
                          />
                        )}

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

                      <FieldGroup className="margin-y-4">
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
                              history.push(
                                `/models/${modelID}/collaboration-area/task-list/it-solutions`
                              )
                            }
                          />
                        )}

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
                        history.push(
                          `/models/${modelID}/collaboration-area/task-list/characteristics`
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

export default KeyCharacteristics;
