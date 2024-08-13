import React, { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Grid,
  GridContainer,
  Icon,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  ClaimsBasedPayType,
  GetComplexityQuery,
  PayType,
  TypedUpdatePaymentsDocument,
  useGetComplexityQuery
} from 'gql/gen/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import FrequencyForm from 'components/FrequencyForm';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { NotFoundPartial } from 'views/NotFound';

import { renderCurrentPage, renderTotalPages } from '..';

type ComplexityFormType = GetComplexityQuery['modelPlan']['payments'];

const Complexity = () => {
  const { t: paymentsT } = useTranslation('payments');

  const { t: paymentsMiscT } = useTranslation('paymentsMisc');

  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    expectedCalculationComplexityLevel: expectedCalculationComplexityLevelConfig,
    claimsProcessingPrecedence: claimsProcessingPrecedenceConfig,
    canParticipantsSelectBetweenPaymentMechanisms: canParticipantsSelectBetweenPaymentMechanismsConfig,
    anticipatedPaymentFrequency: anticipatedPaymentFrequencyConfig
  } = usePlanTranslation('payments');

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<ComplexityFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useGetComplexityQuery({
    variables: {
      id: modelID
    }
  });

  const {
    id,
    payType,
    payClaims,
    expectedCalculationComplexityLevel,
    expectedCalculationComplexityLevelNote,
    claimsProcessingPrecedence,
    claimsProcessingPrecedenceOther,
    claimsProcessingPrecedenceNote,
    canParticipantsSelectBetweenPaymentMechanisms,
    canParticipantsSelectBetweenPaymentMechanismsHow,
    canParticipantsSelectBetweenPaymentMechanismsNote,
    anticipatedPaymentFrequency,
    anticipatedPaymentFrequencyContinually,
    anticipatedPaymentFrequencyOther,
    anticipatedPaymentFrequencyNote
  } = (data?.modelPlan?.payments || {}) as ComplexityFormType;

  const modelName = data?.modelPlan?.modelName || '';

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
    const hasNonClaimBasedPayment = formikRef?.current?.values.payType.includes(
      PayType.NON_CLAIMS_BASED_PAYMENTS
    );

    if (hasNonClaimBasedPayment) {
      history.push(
        `/models/${modelID}/task-list/payment/non-claims-based-payment`
      );
    } else if (hasClaimsBasedPayment) {
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

  const initialValues: ComplexityFormType = {
    __typename: 'PlanPayments',
    id: id ?? '',
    payType: payType ?? [],
    payClaims: payClaims ?? [],
    expectedCalculationComplexityLevel:
      expectedCalculationComplexityLevel ?? null,
    expectedCalculationComplexityLevelNote:
      expectedCalculationComplexityLevelNote ?? '',
    claimsProcessingPrecedence: claimsProcessingPrecedence ?? null,
    claimsProcessingPrecedenceOther: claimsProcessingPrecedenceOther ?? '',
    claimsProcessingPrecedenceNote: claimsProcessingPrecedenceNote ?? '',
    canParticipantsSelectBetweenPaymentMechanisms:
      canParticipantsSelectBetweenPaymentMechanisms ?? null,
    canParticipantsSelectBetweenPaymentMechanismsHow:
      canParticipantsSelectBetweenPaymentMechanismsHow ?? '',
    canParticipantsSelectBetweenPaymentMechanismsNote:
      canParticipantsSelectBetweenPaymentMechanismsNote ?? '',
    anticipatedPaymentFrequency: anticipatedPaymentFrequency ?? [],
    anticipatedPaymentFrequencyContinually:
      anticipatedPaymentFrequencyContinually ?? '',
    anticipatedPaymentFrequencyOther: anticipatedPaymentFrequencyOther ?? '',
    anticipatedPaymentFrequencyNote: anticipatedPaymentFrequencyNote ?? ''
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
          history.push(`/models/${modelID}/task-list/payment/recover-payment`);
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<ComplexityFormType>) => {
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
                      data-testid="payment-complexity-form"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <Fieldset disabled={!!error || loading}>
                        <FieldGroup
                          scrollElement="payment-complexity"
                          error={
                            !!flatErrors.expectedCalculationComplexityLevel
                          }
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="payment-complexity"
                            className="maxw-none"
                          >
                            {paymentsT(
                              'expectedCalculationComplexityLevel.label'
                            )}
                          </Label>

                          <FieldErrorMsg>
                            {flatErrors.expectedCalculationComplexityLevel}
                          </FieldErrorMsg>

                          <Fieldset>
                            {getKeys(
                              expectedCalculationComplexityLevelConfig.options
                            ).map(key => (
                              <Field
                                as={Radio}
                                key={key}
                                id={`payment-complexity-${key}`}
                                data-testid={`payment-complexity-${key}`}
                                name="expectedCalculationComplexityLevel"
                                label={
                                  expectedCalculationComplexityLevelConfig
                                    .options[key]
                                }
                                value={key}
                                checked={
                                  values.expectedCalculationComplexityLevel ===
                                  key
                                }
                              />
                            ))}
                          </Fieldset>

                          <AddNote
                            id="payment-complexity-note"
                            field="expectedCalculationComplexityLevelNote"
                          />
                        </FieldGroup>

                        <FieldGroup
                          scrollElement="payment-claims-processing-precendece"
                          className="margin-y-4 margin-bottom-8"
                        >
                          <Label htmlFor="payment-claims-processing-precendece">
                            {paymentsT('claimsProcessingPrecedence.label')}
                          </Label>

                          <BooleanRadio
                            field="claimsProcessingPrecedence"
                            id="payment-claims-processing-precendece"
                            value={values.claimsProcessingPrecedence}
                            setFieldValue={setFieldValue}
                            options={claimsProcessingPrecedenceConfig.options}
                            childName="claimsProcessingPrecedenceOther"
                          >
                            {values.claimsProcessingPrecedence === true ? (
                              <div className="display-flex margin-left-4 margin-bottom-1">
                                <FieldGroup
                                  className="flex-1 margin-top-1"
                                  scrollElement="claimsProcessingPrecedenceOther"
                                >
                                  <Label
                                    htmlFor="payment-claims-processing-precendece-other"
                                    className="margin-bottom-1 text-normal"
                                  >
                                    {paymentsT(
                                      'claimsProcessingPrecedenceOther.label'
                                    )}
                                  </Label>

                                  <Field
                                    as={TextInput}
                                    data-testid="payment-claims-processing-precendece-other"
                                    id="payment-claims-processing-precendece-other"
                                    name="claimsProcessingPrecedenceOther"
                                  />
                                </FieldGroup>
                              </div>
                            ) : (
                              <></>
                            )}
                          </BooleanRadio>

                          <AddNote
                            id="payment-claims-processing-precendece-note"
                            field="claimsProcessingPrecedenceNote"
                          />
                        </FieldGroup>

                        <FieldGroup
                          scrollElement="payment-multiple-payments"
                          error={
                            !!flatErrors.canParticipantsSelectBetweenPaymentMechanisms
                          }
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="payment-multiple-payments"
                            className="maxw-none"
                          >
                            {paymentsT(
                              'canParticipantsSelectBetweenPaymentMechanisms.label'
                            )}
                          </Label>

                          <FieldErrorMsg>
                            {
                              flatErrors.canParticipantsSelectBetweenPaymentMechanisms
                            }
                          </FieldErrorMsg>

                          <BooleanRadio
                            field="canParticipantsSelectBetweenPaymentMechanisms"
                            id="payment-multiple-payments"
                            value={
                              values.canParticipantsSelectBetweenPaymentMechanisms
                            }
                            setFieldValue={setFieldValue}
                            options={
                              canParticipantsSelectBetweenPaymentMechanismsConfig.options
                            }
                            childName="canParticipantsSelectBetweenPaymentMechanismsHow"
                          >
                            {values.canParticipantsSelectBetweenPaymentMechanisms ? (
                              <FieldGroup
                                className="margin-left-4 margin-y-1"
                                scrollElement="canParticipantsSelectBetweenPaymentMechanismsHow"
                                error={
                                  !!flatErrors.canParticipantsSelectBetweenPaymentMechanismsHow
                                }
                              >
                                <Label
                                  htmlFor="payment-multiple-payments-how"
                                  className="text-normal"
                                >
                                  {paymentsT(
                                    'canParticipantsSelectBetweenPaymentMechanismsHow.label'
                                  )}
                                </Label>

                                <FieldErrorMsg>
                                  {
                                    flatErrors.canParticipantsSelectBetweenPaymentMechanismsHow
                                  }
                                </FieldErrorMsg>

                                <Field
                                  as={TextInput}
                                  error={
                                    flatErrors.canParticipantsSelectBetweenPaymentMechanismsHow
                                  }
                                  id="payment-multiple-payments-how"
                                  data-testid="payment-multiple-payments-how"
                                  name="canParticipantsSelectBetweenPaymentMechanismsHow"
                                />
                              </FieldGroup>
                            ) : (
                              <></>
                            )}
                          </BooleanRadio>

                          <AddNote
                            id="payment-multiple-payments-note"
                            field="canParticipantsSelectBetweenPaymentMechanismsNote"
                          />
                        </FieldGroup>

                        <FrequencyForm
                          field="anticipatedPaymentFrequency"
                          values={values.anticipatedPaymentFrequency}
                          config={anticipatedPaymentFrequencyConfig}
                          nameSpace="payments"
                          id="anticipated-payment-frequency"
                          label={paymentsT('anticipatedPaymentFrequency.label')}
                          disabled={loading}
                        />

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
            6,
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

export default Complexity;
