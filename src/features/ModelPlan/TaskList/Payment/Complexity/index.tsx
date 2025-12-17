import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
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
import { NotFoundPartial } from 'features/NotFound';
import { Field, Formik, FormikProps } from 'formik';
import {
  ClaimsBasedPayType,
  GetComplexityQuery,
  PayType,
  TypedUpdatePaymentsDocument,
  useGetComplexityQuery
} from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import FieldGroup from 'components/FieldGroup';
import FrequencyForm from 'components/FrequencyForm';
import MainContent from 'components/MainContent';
import MINTForm from 'components/MINTForm';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import StickyModelNameWrapper from 'components/StickyModelNameWrapper';
import { ModelInfoContext } from 'contexts/ModelInfoContext';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';

import { renderCurrentPage, renderTotalPages } from '..';

type ComplexityFormType = GetComplexityQuery['modelPlan']['payments'];

const Complexity = () => {
  const { t: paymentsT } = useTranslation('payments');

  const { t: paymentsMiscT } = useTranslation('paymentsMisc');

  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    expectedCalculationComplexityLevel:
      expectedCalculationComplexityLevelConfig,
    claimsProcessingPrecedence: claimsProcessingPrecedenceConfig,
    canParticipantsSelectBetweenPaymentMechanisms:
      canParticipantsSelectBetweenPaymentMechanismsConfig,
    anticipatedPaymentFrequency: anticipatedPaymentFrequencyConfig
  } = usePlanTranslation('payments');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<ComplexityFormType>>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  const { modelName, abbreviation } = useContext(ModelInfoContext);

  const { mutationError } = useHandleMutation(TypedUpdatePaymentsDocument, {
    id,
    formikRef: formikRef as React.RefObject<FormikProps<any>>
  });

  const backPage = () => {
    const hasClaimsBasedPayment = formikRef?.current?.values.payType.includes(
      PayType.CLAIMS_BASED_PAYMENTS
    );
    const hasReductionToCostSharing =
      formikRef?.current?.values.payClaims.includes(
        ClaimsBasedPayType.REDUCTIONS_TO_BENEFICIARY_COST_SHARING
      );
    const hasNonClaimBasedPayment = formikRef?.current?.values.payType.includes(
      PayType.NON_CLAIMS_BASED_PAYMENTS
    );

    if (hasNonClaimBasedPayment) {
      navigate(
        `/models/${modelID}/collaboration-area/model-plan/payment/non-claims-based-payment`
      );
    } else if (hasClaimsBasedPayment) {
      if (hasReductionToCostSharing) {
        navigate(
          `/models/${modelID}/collaboration-area/model-plan/payment/beneficiary-cost-sharing`
        );
      } else {
        navigate(
          `/models/${modelID}/collaboration-area/model-plan/payment/anticipating-dependencies`
        );
      }
    } else {
      navigate(`/models/${modelID}/collaboration-area/model-plan/payment`);
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
    return <NotFoundPartial errorMessage={error?.message} />;
  }

  return (
    <MainContent data-testid="payment-complexity">
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
            BreadcrumbItemOptions.PAYMENTS
          ]}
        />

        <PageHeading className="margin-top-4 margin-bottom-2" ref={headerRef}>
          {paymentsMiscT('heading')}
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
            {miscellaneousT('modelPlanHeading', {
              heading: paymentsMiscT('heading')
            })}
          </h3>
          <p className="margin-y-0 font-body-lg">
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
              `/models/${modelID}/collaboration-area/model-plan/payment/recover-payment`
            );
          }}
          enableReinitialize
          innerRef={formikRef}
        >
          {(formikProps: FormikProps<ComplexityFormType>) => {
            const { handleSubmit, setFieldValue, setErrors, values } =
              formikProps;

            return (
              <>
                <ConfirmLeave />

                <GridContainer className="padding-left-0 padding-right-0">
                  <Grid row gap>
                    <Grid desktop={{ col: 6 }}>
                      <MINTForm
                        className="margin-top-6"
                        data-testid="payment-complexity-form"
                        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                          handleSubmit(e);
                        }}
                      >
                        <Fieldset disabled={!!error || loading}>
                          <FieldGroup className="margin-top-4">
                            <Label
                              htmlFor="payment-complexity"
                              className="maxw-none"
                            >
                              {paymentsT(
                                'expectedCalculationComplexityLevel.label'
                              )}
                            </Label>

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

                          <FieldGroup className="margin-y-4 margin-bottom-8">
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

                          <FieldGroup className="margin-top-4">
                            <Label
                              htmlFor="payment-multiple-payments"
                              className="maxw-none"
                            >
                              {paymentsT(
                                'canParticipantsSelectBetweenPaymentMechanisms.label'
                              )}
                            </Label>

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
                                <FieldGroup className="margin-left-4 margin-y-1">
                                  <Label
                                    htmlFor="payment-multiple-payments-how"
                                    className="text-normal"
                                  >
                                    {paymentsT(
                                      'canParticipantsSelectBetweenPaymentMechanismsHow.label'
                                    )}
                                  </Label>

                                  <Field
                                    as={TextInput}
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
                            label={paymentsT(
                              'anticipatedPaymentFrequency.label'
                            )}
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
      </GridContainer>
    </MainContent>
  );
};

export default Complexity;
