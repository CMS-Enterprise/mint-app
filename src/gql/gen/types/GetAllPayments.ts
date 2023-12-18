/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FundingSource, PayRecipient, PayType, ClaimsBasedPayType, NonClaimsBasedPayType, ComplexityCalculationLevelType, FrequencyTypeNew, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetAllPayments
// ====================================================

export interface GetAllPayments_modelPlan_payments {
  __typename: "PlanPayments";
  fundingSource: FundingSource[];
  fundingSourceMedicareAInfo: string | null;
  fundingSourceMedicareBInfo: string | null;
  fundingSourceOther: string | null;
  fundingSourceNote: string | null;
  fundingSourceR: FundingSource[];
  fundingSourceRMedicareAInfo: string | null;
  fundingSourceRMedicareBInfo: string | null;
  fundingSourceROther: string | null;
  fundingSourceRNote: string | null;
  payRecipients: PayRecipient[];
  payRecipientsOtherSpecification: string | null;
  payRecipientsNote: string | null;
  payType: PayType[];
  payTypeNote: string | null;
  payClaims: ClaimsBasedPayType[];
  payClaimsOther: string | null;
  payClaimsNote: string | null;
  shouldAnyProvidersExcludedFFSSystems: boolean | null;
  shouldAnyProviderExcludedFFSSystemsNote: string | null;
  changesMedicarePhysicianFeeSchedule: boolean | null;
  changesMedicarePhysicianFeeScheduleNote: string | null;
  affectsMedicareSecondaryPayerClaims: boolean | null;
  affectsMedicareSecondaryPayerClaimsHow: string | null;
  affectsMedicareSecondaryPayerClaimsNote: string | null;
  payModelDifferentiation: string | null;
  creatingDependenciesBetweenServices: boolean | null;
  creatingDependenciesBetweenServicesNote: string | null;
  needsClaimsDataCollection: boolean | null;
  needsClaimsDataCollectionNote: string | null;
  providingThirdPartyFile: boolean | null;
  isContractorAwareTestDataRequirements: boolean | null;
  beneficiaryCostSharingLevelAndHandling: string | null;
  waiveBeneficiaryCostSharingForAnyServices: boolean | null;
  waiveBeneficiaryCostSharingServiceSpecification: string | null;
  waiverOnlyAppliesPartOfPayment: boolean | null;
  waiveBeneficiaryCostSharingNote: string | null;
  nonClaimsPayments: NonClaimsBasedPayType[];
  nonClaimsPaymentsNote: string | null;
  nonClaimsPaymentOther: string | null;
  paymentCalculationOwner: string | null;
  numberPaymentsPerPayCycle: string | null;
  numberPaymentsPerPayCycleNote: string | null;
  sharedSystemsInvolvedAdditionalClaimPayment: boolean | null;
  sharedSystemsInvolvedAdditionalClaimPaymentNote: string | null;
  planningToUseInnovationPaymentContractor: boolean | null;
  planningToUseInnovationPaymentContractorNote: string | null;
  expectedCalculationComplexityLevel: ComplexityCalculationLevelType | null;
  expectedCalculationComplexityLevelNote: string | null;
  canParticipantsSelectBetweenPaymentMechanisms: boolean | null;
  canParticipantsSelectBetweenPaymentMechanismsHow: string | null;
  canParticipantsSelectBetweenPaymentMechanismsNote: string | null;
  anticipatedPaymentFrequency: FrequencyTypeNew[];
  anticipatedPaymentFrequencyOther: string | null;
  anticipatedPaymentFrequencyNote: string | null;
  willRecoverPayments: boolean | null;
  willRecoverPaymentsNote: string | null;
  anticipateReconcilingPaymentsRetrospectively: boolean | null;
  anticipateReconcilingPaymentsRetrospectivelyNote: string | null;
  paymentStartDate: Time | null;
  paymentStartDateNote: string | null;
  status: TaskStatus;
}

export interface GetAllPayments_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  payments: GetAllPayments_modelPlan_payments;
}

export interface GetAllPayments {
  modelPlan: GetAllPayments_modelPlan;
}

export interface GetAllPaymentsVariables {
  id: UUID;
}
