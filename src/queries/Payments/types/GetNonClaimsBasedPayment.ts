/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PayType, NonClaimsBasedPayType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetNonClaimsBasedPayment
// ====================================================

export interface GetNonClaimsBasedPayment_modelPlan_payments {
  __typename: "PlanPayments";
  id: UUID;
  payType: PayType[];
  nonClaimsPayments: NonClaimsBasedPayType[];
  nonClaimsPaymentOther: string | null;
  paymentCalculationOwner: string | null;
  numberPaymentsPerPayCycle: string | null;
  numberPaymentsPerPayCycleNote: string | null;
  sharedSystemsInvolvedAdditionalClaimPayment: boolean | null;
  sharedSystemsInvolvedAdditionalClaimPaymentNote: string | null;
  planningToUseInnovationPaymentContractor: boolean | null;
  planningToUseInnovationPaymentContractorNote: string | null;
  fundingStructure: string | null;
}

export interface GetNonClaimsBasedPayment_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  payments: GetNonClaimsBasedPayment_modelPlan_payments;
}

export interface GetNonClaimsBasedPayment {
  modelPlan: GetNonClaimsBasedPayment_modelPlan;
}

export interface GetNonClaimsBasedPaymentVariables {
  id: UUID;
}
