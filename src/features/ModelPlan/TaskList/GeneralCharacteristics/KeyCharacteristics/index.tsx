import React, { Fragment, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  GridContainer,
  Icon,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import { Field, Formik, FormikProps } from 'formik';
import {
  AgencyOrStateHelpType,
  AlternativePaymentModelType,
  GetKeyCharacteristicsQuery,
  KeyCharacteristic,
  TypedUpdatePlanGeneralCharacteristicsDocument,
  useGetKeyCharacteristicsQuery
} from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import Alert from 'components/Alert';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import CheckboxField from 'components/CheckboxField';
import ConfirmLeave from 'components/ConfirmLeave';
import FieldGroup from 'components/FieldGroup';
import MainContent from 'components/MainContent';
import MINTForm from 'components/MINTForm';
import MTOWarning from 'components/MTOWarning';
import MultiSelect from 'components/MultiSelect';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import StickyModelNameWrapper from 'components/StickyModelNameWrapper';
import TextAreaField from 'components/TextAreaField';
import { ModelInfoContext } from 'contexts/ModelInfoContext';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import useScrollElement from 'hooks/useScrollElement';
import { getKeys } from 'types/translation';
import { composeMultiSelectOptions } from 'utils/modelPlan';

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
    phasedIn: phasedInConfig,
    agencyOrStateHelp: agencyOrStateHelpConfig,
    alternativePaymentModelTypes: alternativePaymentModelTypesConfig,
    keyCharacteristics: keyCharacteristicsConfig,
    collectPlanBids: collectPlanBidsConfig,
    managePartCDEnrollment: managePartCDEnrollmentConfig,
    planContractUpdated: planContractUpdatedConfig
  } = usePlanTranslation('generalCharacteristics');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<KeyCharacteristicsFormType>>(null);
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  const { data, loading, error } = useGetKeyCharacteristicsQuery({
    variables: {
      id: modelID
    }
  });

  const { modelName, abbreviation } = useContext(ModelInfoContext);

  const {
    id,
    phasedIn,
    phasedInNote,
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

  // If redirected from Operational Solutions, scrolls to the relevant question
  useScrollElement(!loading);

  const { mutationError } = useHandleMutation(
    TypedUpdatePlanGeneralCharacteristicsDocument,
    {
      id,
      formikRef: formikRef as any
    }
  );

  const initialValues: KeyCharacteristicsFormType = {
    __typename: 'PlanGeneralCharacteristics',
    id: id ?? '',
    phasedIn: phasedIn ?? null,
    phasedInNote: phasedInNote ?? '',
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
    return <NotFoundPartial errorMessage={error?.message} />;
  }

  return (
    <MainContent data-testid="general-characteristics-key-characteristics">
      <GridContainer>
        <MutationErrorModal
          isOpen={mutationError.isModalOpen}
          closeModal={mutationError.closeModal}
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

        <PageHeading className="margin-top-4 margin-bottom-2" ref={headerRef}>
          {generalCharacteristicsMiscT('heading')}
        </PageHeading>

        <p
          className="margin-top-0 margin-bottom-1 font-body-lg"
          data-testid="model-plan-name"
        >
          {miscellaneousT('for')} {modelName}
        </p>
      </GridContainer>
      <StickyModelNameWrapper triggerRef={headerRef}>
        <div className="padding-y-2">
          <h3 className="margin-y-0">
            {generalCharacteristicsMiscT('modelPlanHeading')}:{' '}
            {generalCharacteristicsMiscT('heading')}
          </h3>
          <p className="margin-y-0 font-body-lg" data-testid="model-plan-name">
            {miscellaneousT('for')} {modelName}
            {abbreviation && ` (${abbreviation})`}
          </p>
        </div>
      </StickyModelNameWrapper>

      <GridContainer>
        <p className="margin-bottom-2 font-body-md line-height-sans-4">
          {miscellaneousT('helpText')}
        </p>

        <AskAQuestion modelID={modelID} />

        <Formik
          initialValues={initialValues}
          onSubmit={() => {
            navigate(
              `/models/${modelID}/collaboration-area/model-plan/characteristics/involvements`
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

                <MINTForm
                  className="desktop:grid-col-6 margin-top-6"
                  data-testid="plan-characteristics-key-characteristics-form"
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    handleSubmit(e);
                  }}
                >
                  <Fieldset disabled={!!error || loading}>
                    <FieldGroup className="margin-top-4">
                      <Label htmlFor="phasedIn">
                        {generalCharacteristicsT('phasedIn.label')}
                      </Label>

                      <span className="usa-hint display-block text-normal margin-top-1">
                        {generalCharacteristicsT('phasedIn.sublabel')}
                      </span>

                      <BooleanRadio
                        field="phasedIn"
                        id="phased-in"
                        value={values.phasedIn}
                        setFieldValue={setFieldValue}
                        options={phasedInConfig.options}
                      />
                    </FieldGroup>

                    <AddNote id="phased-in-note" field="phasedInNote" />

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
                          .filter(
                            x => x !== AlternativePaymentModelType.NOT_APM
                          )
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
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
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
                        <FieldGroup
                          className="margin-y-4"
                          scrollElement="collectPlanBids"
                        >
                          <Label
                            htmlFor="plan-characteristics-collect-bids"
                            className="text-normal"
                          >
                            {generalCharacteristicsT('collectPlanBids.label')}
                          </Label>

                          <MTOWarning id="plan-characteristics-collect-bids-warning" />

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

                          <MTOWarning id="plan-characteristics-manage-enrollment-warning" />

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
                          className="margin-y-4"
                          scrollElement="planContractUpdated"
                        >
                          <Label
                            htmlFor="plan-characteristics-contact-updated"
                            className="text-normal"
                          >
                            {generalCharacteristicsT(
                              'planContractUpdated.label'
                            )}
                          </Label>

                          <MTOWarning id="plan-characteristics-contact-updated-warning" />

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
                          navigate(
                            `/models/${modelID}/collaboration-area/model-plan/characteristics`
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
                        navigate(
                          `/models/${modelID}/collaboration-area/model-plan`
                        )
                      }
                    >
                      <Icon.ArrowBack
                        className="margin-right-1"
                        aria-hidden
                        aria-label="back"
                      />

                      {miscellaneousT('saveAndReturn')}
                    </Button>
                  </Fieldset>
                </MINTForm>
              </>
            );
          }}
        </Formik>

        <PageNumber currentPage={2} totalPages={5} className="margin-y-6" />
      </GridContainer>
    </MainContent>
  );
};

export default KeyCharacteristics;
