/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ClaimsBasedPayType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetClaimsBasedPayment
// ====================================================

export interface GetClaimsBasedPayment_modelPlan_payments {
  __typename: "PlanPayments";
  id: UUID;
  payClaims: ClaimsBasedPayType[];
  payClaimsOther: string | null;
  shouldAnyProvidersExcludedFFSSystems: boolean | null;
  shouldAnyProviderExcludedFFSSystemsNote: string | null;
  changesMedicarePhysicianFeeSchedule: boolean | null;
  changesMedicarePhysicianFeeScheduleNote: string | null;
  affectsMedicareSecondaryPayerClaims: boolean | null;
  affectsMedicareSecondaryPayerClaimsHow: string | null;
  affectsMedicareSecondaryPayerClaimsNote: string | null;
  payModelDifferentiation: string | null;
}

export interface GetClaimsBasedPayment_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  payments: GetClaimsBasedPayment_modelPlan_payments;
}

export interface GetClaimsBasedPayment {
  modelPlan: GetClaimsBasedPayment_modelPlan;
}

export interface GetClaimsBasedPaymentVariables {
  id: UUID;
}
