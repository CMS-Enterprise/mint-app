import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Grid,
  GridContainer,
  Icon,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  ClaimsBasedPayType,
  FundingSource as FundingSourceEnum,
  GetFundingQuery,
  PayRecipient,
  PayType,
  TypedUpdatePaymentsDocument,
  useGetFundingQuery
} from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import CheckboxField from 'components/CheckboxField';
import ConfirmLeave from 'components/ConfirmLeave';
import FieldGroup from 'components/FieldGroup';
import MTOWarning from 'components/MTOWarning';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import Tooltip from 'components/Tooltip';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import useScrollElement from 'hooks/useScrollElement';
import { getKeys } from 'types/translation';

import { renderCurrentPage, renderTotalPages } from '..';

import './index.scss';

type FundingFormType = GetFundingQuery['modelPlan']['payments'];

const FundingSource = () => {
  const { t: paymentsT } = useTranslation('payments');

  const { t: paymentsMiscT } = useTranslation('paymentsMisc');

  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    fundingSource: fundingSourceConfig,
    fundingSourceR: fundingSourceRConfig,
    payRecipients: payRecipientsConfig,
    payType: payTypeConfig
  } = usePlanTranslation('payments');

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<FundingFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useGetFundingQuery({
    variables: {
      id: modelID
    }
  });

  // If redirected from Operational Solutions, scrolls to the relevant question
  useScrollElement(!loading);

  const {
    id,
    fundingSource,
    fundingSourcePatientProtectionInfo,
    fundingSourceMedicareAInfo,
    fundingSourceMedicareBInfo,
    fundingSourceOther,
    fundingSourceNote,
    fundingSourceR,
    fundingSourceRPatientProtectionInfo,
    fundingSourceRMedicareAInfo,
    fundingSourceRMedicareBInfo,
    fundingSourceROther,
    fundingSourceRNote,
    payRecipients,
    payRecipientsOtherSpecification,
    payRecipientsNote,
    payType,
    payTypeNote,
    payClaims
  } = (data?.modelPlan?.payments || {}) as FundingFormType;

  const modelName = data?.modelPlan?.modelName || '';

  const { mutationError } = useHandleMutation(TypedUpdatePaymentsDocument, {
    id,
    formikRef
  });

  const nextPage = () => {
    const hasClaimsBasedPayment = formikRef?.current?.values.payType.includes(
      PayType.CLAIMS_BASED_PAYMENTS
    );

    const hasNonClaimBasedPayment = formikRef?.current?.values.payType.includes(
      PayType.NON_CLAIMS_BASED_PAYMENTS
    );

    if (hasClaimsBasedPayment) {
      history.push(
        `/models/${modelID}/collaboration-area/task-list/payment/claims-based-payment`
      );
    } else if (hasNonClaimBasedPayment) {
      history.push(
        `/models/${modelID}/collaboration-area/task-list/payment/non-claims-based-payment`
      );
    } else {
      history.push(
        `/models/${modelID}/collaboration-area/task-list/payment/complexity`
      );
    }
  };

  const initialValues: FundingFormType = {
    __typename: 'PlanPayments',
    id: id ?? '',
    fundingSource: fundingSource ?? [],
    fundingSourcePatientProtectionInfo:
      fundingSourcePatientProtectionInfo ?? '',
    fundingSourceMedicareAInfo: fundingSourceMedicareAInfo ?? '',
    fundingSourceMedicareBInfo: fundingSourceMedicareBInfo ?? '',
    fundingSourceOther: fundingSourceOther ?? '',
    fundingSourceNote: fundingSourceNote ?? '',
    fundingSourceR: fundingSourceR ?? [],
    fundingSourceRPatientProtectionInfo:
      fundingSourceRPatientProtectionInfo ?? '',
    fundingSourceRMedicareAInfo: fundingSourceRMedicareAInfo ?? '',
    fundingSourceRMedicareBInfo: fundingSourceRMedicareBInfo ?? '',
    fundingSourceROther: fundingSourceROther ?? '',
    fundingSourceRNote: fundingSourceRNote ?? '',
    payRecipients: payRecipients ?? [],
    payRecipientsOtherSpecification: payRecipientsOtherSpecification ?? '',
    payRecipientsNote: payRecipientsNote ?? '',
    payType: payType ?? [],
    payTypeNote: payTypeNote ?? '',
    payClaims: payClaims ?? []
  };

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  const FundSelection = ({
    values,
    fieldName,
    config
  }: {
    values: FundingFormType;
    fieldName: 'fundingSource' | 'fundingSourceR';
    config: typeof fundingSourceConfig | typeof fundingSourceRConfig;
  }) => (
    <Fieldset className="funding-source">
      <Label
        htmlFor="fundingSourceType"
        className="maxw-none margin-bottom-105"
      >
        {paymentsT(`${fieldName}.label`)}
      </Label>

      {getKeys(config.options).map(trustType => {
        return (
          <div key={trustType}>
            <div className="display-flex flex-align-center">
              <Field
                key={trustType}
                as={CheckboxField}
                id={`payment-funding-source-${fieldName}-${trustType}`}
                name={fieldName}
                label={config.options[trustType]}
                value={trustType}
                testid={`payment-funding-source-${fieldName}-${trustType}`}
                checked={values[fieldName]?.includes(trustType)}
              />

              {config.tooltips?.[trustType] && (
                <Tooltip
                  label={config.tooltips?.[trustType] || ''}
                  position="right"
                  className="margin-left-05"
                >
                  <Icon.Info className="text-base-light" />
                </Tooltip>
              )}
            </div>

            {trustType ===
              FundingSourceEnum.PATIENT_PROTECTION_AFFORDABLE_CARE_ACT &&
              values[fieldName]?.includes(trustType) && (
                <FieldGroup className="margin-left-4 margin-top-1 margin-bottom-2">
                  <Label
                    htmlFor={`${fieldName}PatientProtectionInfo`}
                    className="text-normal"
                  >
                    {paymentsT(`${fieldName}PatientProtectionInfo.label`)}
                  </Label>

                  <Field
                    as={TextInput}
                    id={`payment-${fieldName}-patient-protection-info`}
                    maxLength={50}
                    name={`${fieldName}PatientProtectionInfo`}
                  />
                </FieldGroup>
              )}

            {trustType === FundingSourceEnum.MEDICARE_PART_A_HI_TRUST_FUND &&
              values[fieldName]?.includes(trustType) && (
                <FieldGroup className="margin-left-4 margin-top-1 margin-bottom-2">
                  <Label
                    htmlFor={`${fieldName}MedicareAInfo`}
                    className="text-normal"
                  >
                    {paymentsT(`${fieldName}MedicareAInfo.label`)}
                  </Label>

                  <Field
                    as={TextInput}
                    id={`payment-${fieldName}-medicare-a-info`}
                    maxLength={50}
                    name={`${fieldName}MedicareAInfo`}
                  />
                </FieldGroup>
              )}

            {trustType === FundingSourceEnum.MEDICARE_PART_B_SMI_TRUST_FUND &&
              values[fieldName]?.includes(trustType) && (
                <FieldGroup className="margin-left-4 margin-top-1 margin-bottom-2">
                  <Label
                    htmlFor={`${fieldName}MedicareBInfo`}
                    className="text-normal"
                  >
                    {paymentsT(`${fieldName}MedicareBInfo.label`)}
                  </Label>

                  <Field
                    as={TextInput}
                    id={`payment-${fieldName}-medicare-b-info`}
                    maxLength={50}
                    name={`${fieldName}MedicareBInfo`}
                  />
                </FieldGroup>
              )}

            {trustType === FundingSourceEnum.OTHER &&
              values[fieldName]?.includes(trustType) && (
                <FieldGroup className="margin-left-4 margin-top-1 margin-bottom-2">
                  <Label htmlFor={`${fieldName}Other`} className="text-normal">
                    {paymentsT(`${fieldName}Other.label`)}
                  </Label>

                  <Field
                    as={TextInput}
                    id={`payment-${fieldName}-other`}
                    maxLength={50}
                    name={`${fieldName}Other`}
                  />
                </FieldGroup>
              )}
          </div>
        );
      })}
    </Fieldset>
  );

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
          BreadcrumbItemOptions.PAYMENTS
        ]}
      />

      <PageHeading className="margin-top-4 margin-bottom-2">
        {paymentsMiscT('heading')}
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
          nextPage();
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<FundingFormType>) => {
          const { handleSubmit, setErrors, values } = formikProps;

          return (
            <>
              <ConfirmLeave />

              <GridContainer className="padding-left-0 padding-right-0">
                <Grid row gap>
                  <Grid desktop={{ col: 6 }}>
                    <Form
                      className="margin-top-6"
                      data-testid="payment-funding-source-form"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <Fieldset disabled={!!error || loading}>
                        <FieldGroup className="margin-top-4">
                          <FundSelection
                            values={values}
                            fieldName="fundingSource"
                            config={fundingSourceConfig}
                          />

                          <AddNote
                            id="payment-funding-source-note"
                            field="fundingSourceNote"
                          />
                        </FieldGroup>

                        <FieldGroup
                          scrollElement="fundingSourceR"
                          className="margin-top-4"
                        >
                          <FundSelection
                            values={values}
                            fieldName="fundingSourceR"
                            config={fundingSourceRConfig}
                          />

                          <AddNote
                            id="payment-funding-source-reconciliation-note"
                            field="fundingSourceRNote"
                          />
                        </FieldGroup>

                        <FieldGroup className="margin-top-4">
                          <Label htmlFor="payRecipients" className="maxw-none">
                            {paymentsT('payRecipients.label')}
                          </Label>

                          <Fieldset>
                            {getKeys(payRecipientsConfig.options).map(type => {
                              return (
                                <Fragment key={type}>
                                  <Field
                                    as={CheckboxField}
                                    id={`payment-pay-recipients-${type}`}
                                    name="payRecipients"
                                    label={payRecipientsConfig.options[type]}
                                    value={type}
                                    checked={values.payRecipients.includes(
                                      type
                                    )}
                                  />

                                  {type === PayRecipient.OTHER &&
                                    values.payRecipients.includes(type) && (
                                      <FieldGroup className="margin-left-4 margin-top-2 margin-bottom-4">
                                        <Label
                                          htmlFor="payRecipientsOtherSpecification"
                                          className="text-normal"
                                        >
                                          {paymentsT(
                                            'payRecipientsOtherSpecification.label'
                                          )}
                                        </Label>

                                        <Field
                                          as={TextInput}
                                          id="payment-pay-recipients-other-specification"
                                          maxLength={50}
                                          name="payRecipientsOtherSpecification"
                                        />
                                      </FieldGroup>
                                    )}
                                </Fragment>
                              );
                            })}
                          </Fieldset>

                          <AddNote
                            id="payment-pay-recipients-note"
                            field="payRecipientsNote"
                          />
                        </FieldGroup>

                        <FieldGroup className="margin-top-4">
                          <Label htmlFor="payType" className="maxw-none">
                            {paymentsT('payType.label')}
                          </Label>

                          <MTOWarning id="payment-pay-recipients-warning" />

                          <p className="text-base margin-y-1 margin-top-2">
                            {paymentsT('payType.sublabel')}
                          </p>

                          <Fieldset>
                            {getKeys(payTypeConfig.options).map(type => {
                              return (
                                <Field
                                  key={type}
                                  as={CheckboxField}
                                  id={`payment-pay-recipients-${type}`}
                                  name="payType"
                                  label={payTypeConfig.options[type]}
                                  value={type}
                                  checked={values.payType.includes(type)}
                                />
                              );
                            })}
                          </Fieldset>

                          <AddNote
                            id="payment-pay-type-note"
                            field="payTypeNote"
                          />
                        </FieldGroup>

                        <div className="margin-top-6 margin-bottom-3">
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
                          <Icon.ArrowBack
                            className="margin-right-1"
                            aria-hidden
                          />

                          {miscellaneousT('saveAndReturn')}
                        </Button>
                      </Fieldset>
                    </Form>
                  </Grid>
                </Grid>
              </GridContainer>
            </>
          );
        }}
      </Formik>

      {data && (
        <PageNumber
          currentPage={renderCurrentPage(
            1,
            payType.includes(PayType.CLAIMS_BASED_PAYMENTS),
            payType.includes(PayType.NON_CLAIMS_BASED_PAYMENTS),
            payClaims.includes(
              ClaimsBasedPayType.REDUCTIONS_TO_BENEFICIARY_COST_SHARING
            )
          )}
          totalPages={renderTotalPages(
            payType.includes(PayType.CLAIMS_BASED_PAYMENTS),
            payType.includes(PayType.NON_CLAIMS_BASED_PAYMENTS),
            payClaims.includes(
              ClaimsBasedPayType.REDUCTIONS_TO_BENEFICIARY_COST_SHARING
            )
          )}
          className="margin-y-6"
        />
      )}
    </>
  );
};

export default FundingSource;
