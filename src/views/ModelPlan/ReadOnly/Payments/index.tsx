import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GetAllPaymentsQuery,
  PayType,
  useGetAllPaymentsQuery
} from 'gql/gen/graphql';

import PageLoading from 'components/PageLoading';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import { NotFoundPartial } from 'views/NotFound';

import ReadOnlyBody from '../_components/Body';
import { RelatedUnneededQuestions } from '../_components/ReadOnlySection';
import { getFilterGroupInfo } from '../_components/ReadOnlySection/util';
import TitleAndStatus from '../_components/TitleAndStatus';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyPayments = ({
  modelID,
  clearance,
  filteredView
}: ReadOnlyProps) => {
  const { t: paymentsMiscT } = useTranslation('paymentsMisc');
  const { t: prepareForClearanceT } = useTranslation('prepareForClearance');

  const { modelName } = useContext(ModelInfoContext);

  const paymentsConfig = usePlanTranslation('payments');

  const { data, loading, error } = useGetAllPaymentsQuery({
    variables: {
      id: modelID
    }
  });

  if ((!loading && error) || (!loading && !data)) {
    return <NotFoundPartial />;
  }

  const allPaymentData = (data?.modelPlan.payments ||
    {}) as GetAllPaymentsQuery['modelPlan']['payments'];

  const paymentsConfigOne = {
    fundingSource: paymentsConfig.fundingSource,
    fundingSourceNote: paymentsConfig.fundingSourceNote,
    fundingSourceR: paymentsConfig.fundingSourceR,
    fundingSourceRNote: paymentsConfig.fundingSourceRNote,
    payRecipients: paymentsConfig.payRecipients,
    payRecipientsOtherSpecification:
      paymentsConfig.payRecipientsOtherSpecification,
    payRecipientsNote: paymentsConfig.payRecipientsNote,
    payType: paymentsConfig.payType,
    payTypeNote: paymentsConfig.payTypeNote
  };

  const claimsConfig = {
    payClaims: paymentsConfig.payClaims,
    payClaimsOther: paymentsConfig.payClaimsOther,
    payClaimsNote: paymentsConfig.payClaimsNote,
    shouldAnyProvidersExcludedFFSSystems:
      paymentsConfig.shouldAnyProvidersExcludedFFSSystems,
    shouldAnyProviderExcludedFFSSystemsNote:
      paymentsConfig.shouldAnyProviderExcludedFFSSystemsNote,
    changesMedicarePhysicianFeeSchedule:
      paymentsConfig.changesMedicarePhysicianFeeSchedule,
    changesMedicarePhysicianFeeScheduleNote:
      paymentsConfig.changesMedicarePhysicianFeeScheduleNote,
    affectsMedicareSecondaryPayerClaims:
      paymentsConfig.affectsMedicareSecondaryPayerClaims,
    affectsMedicareSecondaryPayerClaimsHow:
      paymentsConfig.affectsMedicareSecondaryPayerClaimsHow,
    affectsMedicareSecondaryPayerClaimsNote:
      paymentsConfig.affectsMedicareSecondaryPayerClaimsNote,
    payModelDifferentiation: paymentsConfig.payModelDifferentiation,
    willBePaymentAdjustments: paymentsConfig.willBePaymentAdjustments,
    willBePaymentAdjustmentsNote: paymentsConfig.willBePaymentAdjustmentsNote,
    creatingDependenciesBetweenServices:
      paymentsConfig.creatingDependenciesBetweenServices,
    creatingDependenciesBetweenServicesNote:
      paymentsConfig.creatingDependenciesBetweenServicesNote,
    needsClaimsDataCollection: paymentsConfig.needsClaimsDataCollection,
    needsClaimsDataCollectionNote: paymentsConfig.needsClaimsDataCollectionNote,
    providingThirdPartyFile: paymentsConfig.providingThirdPartyFile,
    isContractorAwareTestDataRequirements:
      paymentsConfig.isContractorAwareTestDataRequirements
  };

  const beneficiaryConfig = {
    beneficiaryCostSharingLevelAndHandling:
      paymentsConfig.beneficiaryCostSharingLevelAndHandling,
    waiveBeneficiaryCostSharingForAnyServices:
      paymentsConfig.waiveBeneficiaryCostSharingForAnyServices,
    waiveBeneficiaryCostSharingServiceSpecification:
      paymentsConfig.waiveBeneficiaryCostSharingServiceSpecification,
    waiverOnlyAppliesPartOfPayment:
      paymentsConfig.waiverOnlyAppliesPartOfPayment,
    waiveBeneficiaryCostSharingNote:
      paymentsConfig.waiveBeneficiaryCostSharingNote
  };

  const nonClaimsConfig = {
    nonClaimsPayments: paymentsConfig.nonClaimsPayments,
    nonClaimsPaymentsNote: paymentsConfig.nonClaimsPaymentsNote,
    nonClaimsPaymentOther: paymentsConfig.nonClaimsPaymentOther,
    paymentCalculationOwner: paymentsConfig.paymentCalculationOwner,
    numberPaymentsPerPayCycle: paymentsConfig.numberPaymentsPerPayCycle,
    numberPaymentsPerPayCycleNote: paymentsConfig.numberPaymentsPerPayCycleNote,
    sharedSystemsInvolvedAdditionalClaimPayment:
      paymentsConfig.sharedSystemsInvolvedAdditionalClaimPayment,
    sharedSystemsInvolvedAdditionalClaimPaymentNote:
      paymentsConfig.sharedSystemsInvolvedAdditionalClaimPaymentNote,
    planningToUseInnovationPaymentContractor:
      paymentsConfig.planningToUseInnovationPaymentContractor,
    planningToUseInnovationPaymentContractorNote:
      paymentsConfig.planningToUseInnovationPaymentContractorNote
  };

  const paymentsConfigTwo = {
    expectedCalculationComplexityLevel:
      paymentsConfig.expectedCalculationComplexityLevel,
    expectedCalculationComplexityLevelNote:
      paymentsConfig.expectedCalculationComplexityLevelNote,
    claimsProcessingPrecedence: paymentsConfig.claimsProcessingPrecedence,
    claimsProcessingPrecedenceOther:
      paymentsConfig.claimsProcessingPrecedenceOther,
    claimsProcessingPrecedenceNote:
      paymentsConfig.claimsProcessingPrecedenceNote,
    canParticipantsSelectBetweenPaymentMechanisms:
      paymentsConfig.canParticipantsSelectBetweenPaymentMechanisms,
    canParticipantsSelectBetweenPaymentMechanismsHow:
      paymentsConfig.canParticipantsSelectBetweenPaymentMechanismsHow,
    canParticipantsSelectBetweenPaymentMechanismsNote:
      paymentsConfig.canParticipantsSelectBetweenPaymentMechanismsNote,
    anticipatedPaymentFrequency: paymentsConfig.anticipatedPaymentFrequency,
    anticipatedPaymentFrequencyNote:
      paymentsConfig.anticipatedPaymentFrequencyNote,
    willRecoverPayments: paymentsConfig.willRecoverPayments,
    willRecoverPaymentsNote: paymentsConfig.willRecoverPaymentsNote,
    anticipateReconcilingPaymentsRetrospectively:
      paymentsConfig.anticipateReconcilingPaymentsRetrospectively,
    anticipateReconcilingPaymentsRetrospectivelyNote:
      paymentsConfig.anticipateReconcilingPaymentsRetrospectivelyNote,
    paymentReconciliationFrequency:
      paymentsConfig.paymentReconciliationFrequency,
    paymentReconciliationFrequencyNote:
      paymentsConfig.paymentReconciliationFrequencyNote,
    paymentDemandRecoupmentFrequency:
      paymentsConfig.paymentDemandRecoupmentFrequency,
    paymentDemandRecoupmentFrequencyNote:
      paymentsConfig.paymentDemandRecoupmentFrequencyNote,
    paymentStartDate: paymentsConfig.paymentStartDate,
    paymentStartDateNote: paymentsConfig.paymentStartDateNote
  };

  const claimsFilterGroupFields = getFilterGroupInfo(
    claimsConfig,
    filteredView
  );
  const beneficiaryFilterGroupFields = getFilterGroupInfo(
    beneficiaryConfig,
    filteredView
  );
  const nonClaimsFilterGroupFields = getFilterGroupInfo(
    nonClaimsConfig,
    filteredView
  );

  const claimsAndNonClaims = claimsFilterGroupFields.concat(
    nonClaimsFilterGroupFields
  );

  return (
    <div
      className="read-only-model-plan--payments"
      data-testid="read-only-model-plan--payments"
    >
      <TitleAndStatus
        clearance={clearance}
        clearanceTitle={paymentsMiscT('clearanceHeading')}
        heading={paymentsMiscT('heading')}
        isViewingFilteredView={!!filteredView}
        status={allPaymentData.status}
      />

      {clearance && (
        <p className="font-body-lg margin-top-neg-2 margin-bottom-6">
          {prepareForClearanceT('forModelPlan', {
            modelName
          })}
        </p>
      )}

      {loading && !data ? (
        <div className="height-viewport">
          <PageLoading />
        </div>
      ) : (
        <>
          {/* First few sections of Payments data that can be automated */}
          <ReadOnlyBody
            data={allPaymentData}
            config={paymentsConfigOne}
            filteredView={filteredView}
          />

          {/* Claims-based payments */}
          {(!filteredView || claimsFilterGroupFields.length > 0) && (
            <div
              className={`${
                filteredView
                  ? ''
                  : 'margin-top-4 padding-top-4 border-top-1px border-base-light'
              }`}
            >
              {!filteredView && (
                <h3 className="margin-top-0">{paymentsMiscT('claims')}</h3>
              )}

              {/* In filter view, bundle claims and non-claims alerts together if claims alerts exist */}
              <RelatedUnneededQuestions
                id="claims-questions"
                config={paymentsConfig.payType}
                value={allPaymentData.payType}
                valuesToCheck={
                  filteredView
                    ? [
                        PayType.CLAIMS_BASED_PAYMENTS,
                        PayType.NON_CLAIMS_BASED_PAYMENTS
                      ]
                    : [PayType.CLAIMS_BASED_PAYMENTS]
                }
                childrenToCheck={filteredView ? claimsAndNonClaims : undefined}
                hideAlert={false}
              />

              <ReadOnlyBody
                data={allPaymentData}
                config={claimsConfig}
                filteredView={filteredView}
              />
            </div>
          )}

          {/* Beneficiary cost-sharing */}
          {(!filteredView || beneficiaryFilterGroupFields.length > 0) && (
            <div
              className={`${
                filteredView
                  ? ''
                  : 'margin-top-4 padding-top-4 border-top-1px border-base-light'
              }`}
            >
              {!filteredView && (
                <h3 className="margin-top-0">
                  {paymentsMiscT('beneficiaryCostSharing')}
                </h3>
              )}

              <RelatedUnneededQuestions
                id="cost-sharing-questions"
                config={paymentsConfig.payClaims}
                value={allPaymentData.payClaims}
                values={allPaymentData}
                childrenToCheck={
                  filteredView ? beneficiaryFilterGroupFields : undefined
                }
                hideAlert={false}
              />

              <ReadOnlyBody
                data={allPaymentData}
                config={beneficiaryConfig}
                filteredView={filteredView}
              />
            </div>
          )}

          {/* Non claims-based payments */}
          {(!filteredView || nonClaimsFilterGroupFields.length > 0) && (
            <div
              className={`${
                filteredView
                  ? ''
                  : 'margin-top-4 padding-top-4 border-top-1px border-base-light'
              }`}
            >
              {!filteredView && (
                <h3 className="margin-top-0">{paymentsMiscT('nonClaims')}</h3>
              )}

              {/* In filtered view, only show non-claims alert if there are no claims alert.  Claims alert will bundle both claims/non-claims if it exists */}
              <RelatedUnneededQuestions
                id="cost-sharing-questions"
                config={paymentsConfig.payType}
                value={allPaymentData.payType}
                valuesToCheck={[PayType.NON_CLAIMS_BASED_PAYMENTS]}
                childrenToCheck={
                  filteredView ? nonClaimsFilterGroupFields : undefined
                }
                hideAlert={claimsFilterGroupFields.length > 0}
              />

              <ReadOnlyBody
                data={allPaymentData}
                config={nonClaimsConfig}
                filteredView={filteredView}
              />
            </div>
          )}

          <ReadOnlyBody
            data={allPaymentData}
            config={paymentsConfigTwo}
            filteredView={filteredView}
          />
        </>
      )}
    </div>
  );
};

export default ReadOnlyPayments;
