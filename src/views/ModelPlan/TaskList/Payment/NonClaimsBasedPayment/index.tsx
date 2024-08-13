import React, { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Grid,
  GridContainer,
  Icon,
  Label
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  ClaimsBasedPayType,
  GetNonClaimsBasedPaymentQuery,
  NonClaimsBasedPayType,
  PayType,
  TypedUpdatePaymentsDocument,
  useGetNonClaimsBasedPaymentQuery
} from 'gql/gen/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import ITSolutionsWarning from 'components/ITSolutionsWarning';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import TextField from 'components/shared/TextField';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import useScrollElement from 'hooks/useScrollElement';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { composeMultiSelectOptions } from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import { renderCurrentPage, renderTotalPages } from '..';

type NonClaimsBasedPaymentFormType = GetNonClaimsBasedPaymentQuery['modelPlan']['payments'];

const NonClaimsBasedPayment = () => {
  const { t: paymentsT } = useTranslation('payments');

  const { t: paymentsMiscT } = useTranslation('paymentsMisc');

  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    nonClaimsPayments: nonClaimsPaymentsConfig,
    sharedSystemsInvolvedAdditionalClaimPayment: sharedSystemsInvolvedAdditionalClaimPaymentConfig,
    planningToUseInnovationPaymentContractor: planningToUseInnovationPaymentContractorConfig
  } = usePlanTranslation('payments');

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<NonClaimsBasedPaymentFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useGetNonClaimsBasedPaymentQuery({
    variables: {
      id: modelID
    }
  });

  // If redirected from Operational Solutions, scrolls to the relevant question
  useScrollElement(!loading);

  const {
    id,
    payType,
    payClaims,
    nonClaimsPayments,
    nonClaimsPaymentsNote,
    nonClaimsPaymentOther,
    paymentCalculationOwner,
    numberPaymentsPerPayCycle,
    numberPaymentsPerPayCycleNote,
    sharedSystemsInvolvedAdditionalClaimPayment,
    sharedSystemsInvolvedAdditionalClaimPaymentNote,
    planningToUseInnovationPaymentContractor,
    planningToUseInnovationPaymentContractorNote
  } = (data?.modelPlan?.payments || {}) as NonClaimsBasedPaymentFormType;

  const modelName = data?.modelPlan?.modelName || '';

  const itSolutionsStarted: boolean = !!data?.modelPlan.operationalNeeds.find(
    need => need.modifiedDts
  );

  const { mutationError } = useHandleMutation(TypedUpdatePaymentsDocument, {
    id,
    formikRef
  });

  const backPage = () => {
    const hasClaimsBasedPayment = formikRef?.current?.values.payType.includes(
      PayType.CLAIMS_BASED_PAYMENTS
    );
    const hasReductionToCostSharing = formikRef?.current?.values.payClaims.includes(
      ClaimsBasedPayType.REDUCTIONS_TO_BENEFICIARY_COST_SHARING
    );

    if (hasClaimsBasedPayment) {
      if (hasReductionToCostSharing) {
        history.push(
          `/models/${modelID}/task-list/payment/beneficiary-cost-sharing`
        );
      } else {
        history.push(
          `/models/${modelID}/task-list/payment/anticipating-dependencies`
        );
      }
    } else {
      history.push(`/models/${modelID}/task-list/payment`);
    }
  };

  const initialValues: NonClaimsBasedPaymentFormType = {
    __typename: 'PlanPayments',
    id: id ?? '',
    payType: payType ?? [],
    payClaims: payClaims ?? [],
    nonClaimsPayments: nonClaimsPayments ?? [],
    nonClaimsPaymentsNote: nonClaimsPaymentsNote ?? '',
    nonClaimsPaymentOther: nonClaimsPaymentOther ?? '',
    paymentCalculationOwner: paymentCalculationOwner ?? '',
    numberPaymentsPerPayCycle: numberPaymentsPerPayCycle ?? '',
    numberPaymentsPerPayCycleNote: numberPaymentsPerPayCycleNote ?? '',
    sharedSystemsInvolvedAdditionalClaimPayment:
      sharedSystemsInvolvedAdditionalClaimPayment ?? null,
    sharedSystemsInvolvedAdditionalClaimPaymentNote:
      sharedSystemsInvolvedAdditionalClaimPaymentNote ?? '',
    planningToUseInnovationPaymentContractor:
      planningToUseInnovationPaymentContractor ?? null,
    planningToUseInnovationPaymentContractorNote:
      planningToUseInnovationPaymentContractorNote ?? ''
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
        <Trans i18nKey="modelPlanTaskList:subheading">
          indexZero {modelName || ' '} indexTwo
        </Trans>
      </p>

      <p className="margin-bottom-2 font-body-md line-height-sans-4">
        {miscellaneousT('helpText')}
      </p>

      <AskAQuestion modelID={modelID} />

      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          history.push(`/models/${modelID}/task-list/payment/complexity`);
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<NonClaimsBasedPaymentFormType>) => {
          const {
            errors,
            handleSubmit,
            setFieldValue,
            setErrors,
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

              <ConfirmLeave />

              <GridContainer className="padding-left-0 padding-right-0">
                <Grid row gap>
                  <Grid desktop={{ col: 6 }}>
                    <Form
                      className="margin-top-6"
                      data-testid="payment-non-claims-based-payment-form"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <Fieldset disabled={!!error || loading}>
                        <PageHeading
                          headingLevel="h3"
                          className="margin-bottom-3"
                        >
                          {paymentsMiscT('nonClaimsBasedPaymentQuestion')}
                        </PageHeading>

                        <FieldGroup
                          scrollElement="nonClaimsPayments"
                          error={!!flatErrors.nonClaimsPayments}
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="payment-nonclaims-payments"
                            id="label-payment-nonclaims-payments"
                          >
                            {paymentsT('nonClaimsPayments.label')}
                          </Label>

                          {itSolutionsStarted && (
                            <ITSolutionsWarning
                              id="payment-nonclaims-payments-warning"
                              onClick={() =>
                                history.push(
                                  `/models/${modelID}/task-list/it-solutions`
                                )
                              }
                            />
                          )}

                          <FieldErrorMsg>
                            {flatErrors.nonClaimsPayments}
                          </FieldErrorMsg>

                          <Field
                            as={MultiSelect}
                            id="payment-nonclaims-payments"
                            name="payment-nonclaims-payments"
                            ariaLabel="label-payment-nonclaims-payments"
                            options={composeMultiSelectOptions(
                              nonClaimsPaymentsConfig.options
                            )}
                            selectedLabel={paymentsT(
                              'nonClaimsPayments.multiSelectLabel'
                            )}
                            onChange={(value: string[] | []) => {
                              setFieldValue('nonClaimsPayments', value);
                            }}
                            initialValues={initialValues.nonClaimsPayments}
                          />

                          {(values?.nonClaimsPayments || []).includes(
                            NonClaimsBasedPayType.OTHER
                          ) && (
                            <FieldGroup
                              scrollElement="payment-nonclaims-payments-other"
                              error={!!flatErrors.nonClaimsPaymentOther}
                            >
                              <Label
                                htmlFor="nonClaimsPaymentOther"
                                className="text-normal"
                              >
                                {paymentsT('nonClaimsPaymentOther.label')}
                              </Label>

                              <FieldErrorMsg>
                                {flatErrors.nonClaimsPaymentOther}
                              </FieldErrorMsg>

                              <Field
                                as={TextField}
                                error={flatErrors.nonClaimsPaymentOther}
                                id="payment-nonclaims-payments-other"
                                data-testid="payment-nonclaims-payments-other"
                                name="nonClaimsPaymentOther"
                              />
                            </FieldGroup>
                          )}

                          <AddNote
                            id="payment-nonclaims-payments-note"
                            field="nonClaimsPaymentsNote"
                          />
                        </FieldGroup>

                        <FieldGroup
                          scrollElement="payment-nonclaims-payments-owner"
                          error={!!flatErrors.paymentCalculationOwner}
                        >
                          <Label htmlFor="paymentCalculationOwner">
                            {paymentsT('paymentCalculationOwner.label')}
                          </Label>

                          <FieldErrorMsg>
                            {flatErrors.paymentCalculationOwner}
                          </FieldErrorMsg>

                          <Field
                            as={TextField}
                            error={flatErrors.paymentCalculationOwner}
                            id="payment-nonclaims-payments-owner"
                            data-testid="payment-nonclaims-payments-owner"
                            name="paymentCalculationOwner"
                          />
                        </FieldGroup>

                        <FieldGroup
                          scrollElement="payment-nonclaims-payments-paycycle"
                          error={!!flatErrors.numberPaymentsPerPayCycle}
                        >
                          <Label htmlFor="numberPaymentsPerPayCycle">
                            {paymentsT('numberPaymentsPerPayCycle.label')}
                          </Label>

                          <p className="text-base margin-y-1">
                            {paymentsT('numberPaymentsPerPayCycle.sublabel')}
                          </p>

                          <FieldErrorMsg>
                            {flatErrors.numberPaymentsPerPayCycle}
                          </FieldErrorMsg>

                          <Field
                            as={TextField}
                            error={flatErrors.numberPaymentsPerPayCycle}
                            id="payment-nonclaims-payments-paycycle"
                            data-testid="payment-nonclaims-payments-paycycle"
                            name="numberPaymentsPerPayCycle"
                          />

                          <AddNote
                            id="payment-nonclaims-payments-paycycle-note"
                            field="numberPaymentsPerPayCycleNote"
                          />
                        </FieldGroup>

                        <FieldGroup
                          scrollElement="payment-nonclaims-shared-involvement"
                          error={
                            !!flatErrors.sharedSystemsInvolvedAdditionalClaimPayment
                          }
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="payment-nonclaims-shared-involvement"
                            className="maxw-none"
                          >
                            {paymentsT(
                              'sharedSystemsInvolvedAdditionalClaimPayment.label'
                            )}
                          </Label>

                          <FieldErrorMsg>
                            {
                              flatErrors.sharedSystemsInvolvedAdditionalClaimPayment
                            }
                          </FieldErrorMsg>

                          <BooleanRadio
                            field="sharedSystemsInvolvedAdditionalClaimPayment"
                            id="payment-nonclaims-shared-involvement"
                            value={
                              values.sharedSystemsInvolvedAdditionalClaimPayment
                            }
                            setFieldValue={setFieldValue}
                            options={
                              sharedSystemsInvolvedAdditionalClaimPaymentConfig.options
                            }
                          />

                          <AddNote
                            id="payment-nonclaims-shared-involvement-note"
                            field="sharedSystemsInvolvedAdditionalClaimPaymentNote"
                          />
                        </FieldGroup>

                        <FieldGroup
                          scrollElement="payment-use-innovation-payment-contractor"
                          error={
                            !!flatErrors.planningToUseInnovationPaymentContractor
                          }
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="payment-use-innovation-payment-contractor"
                            className="maxw-none"
                          >
                            {paymentsT(
                              'planningToUseInnovationPaymentContractor.label'
                            )}
                          </Label>

                          <p className="text-base margin-y-1">
                            {paymentsT(
                              'planningToUseInnovationPaymentContractor.sublabel'
                            )}
                          </p>

                          <FieldErrorMsg>
                            {
                              flatErrors.planningToUseInnovationPaymentContractor
                            }
                          </FieldErrorMsg>

                          <BooleanRadio
                            field="planningToUseInnovationPaymentContractor"
                            id="payment-use-innovation-payment-contractor"
                            value={
                              values.planningToUseInnovationPaymentContractor
                            }
                            setFieldValue={setFieldValue}
                            options={
                              planningToUseInnovationPaymentContractorConfig.options
                            }
                          />

                          <AddNote
                            id="payment-use-innovation-payment-contractor-note"
                            field="planningToUseInnovationPaymentContractorNote"
                          />
                        </FieldGroup>

                        <div className="margin-top-6 margin-bottom-3">
                          <Button
                            type="button"
                            className="usa-button usa-button--outline margin-bottom-1"
                            onClick={() => {
                              backPage();
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
                            history.push(`/models/${modelID}/task-list`)
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
            5,
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

export default NonClaimsBasedPayment;
