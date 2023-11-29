/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PayType, ClaimsBasedPayType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetBeneficiaryCostSharing
// ====================================================

export interface GetBeneficiaryCostSharing_modelPlan_payments {
  __typename: "PlanPayments";
  id: UUID;
  payType: PayType[];
  payClaims: ClaimsBasedPayType[];
  beneficiaryCostSharingLevelAndHandling: string | null;
  waiveBeneficiaryCostSharingForAnyServices: boolean | null;
  waiveBeneficiaryCostSharingServiceSpecification: string | null;
  waiverOnlyAppliesPartOfPayment: boolean | null;
  waiveBeneficiaryCostSharingNote: string | null;
}

export interface GetBeneficiaryCostSharing_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  payments: GetBeneficiaryCostSharing_modelPlan_payments;
}

export interface GetBeneficiaryCostSharing {
  modelPlan: GetBeneficiaryCostSharing_modelPlan;
}

export interface GetBeneficiaryCostSharingVariables {
  id: UUID;
}
