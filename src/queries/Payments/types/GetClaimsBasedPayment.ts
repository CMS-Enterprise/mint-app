/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PayType, ClaimsBasedPayType, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetClaimsBasedPayment
// ====================================================

export interface GetClaimsBasedPayment_modelPlan_payments {
  __typename: "PlanPayments";
  id: UUID;
  payType: PayType[];
  payClaims: ClaimsBasedPayType[];
  payClaimsNote: string | null;
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

export interface GetClaimsBasedPayment_modelPlan_itTools {
  __typename: "PlanITTools";
  status: TaskStatus;
}

export interface GetClaimsBasedPayment_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  payments: GetClaimsBasedPayment_modelPlan_payments;
  itTools: GetClaimsBasedPayment_modelPlan_itTools;
}

export interface GetClaimsBasedPayment {
  modelPlan: GetClaimsBasedPayment_modelPlan;
}

export interface GetClaimsBasedPaymentVariables {
  id: UUID;
}
