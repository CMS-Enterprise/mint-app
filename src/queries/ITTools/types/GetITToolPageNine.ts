/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PayType, NonClaimsBasedPayType, PNonClaimsBasedPaymentsType, PSharedSavingsPlanType, PRecoverPaymentsType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetITToolPageNine
// ====================================================

export interface GetITToolPageNine_modelPlan_payments {
  __typename: "PlanPayments";
  id: UUID;
  payType: PayType[];
  nonClaimsPayments: NonClaimsBasedPayType[];
  willRecoverPayments: boolean | null;
}

export interface GetITToolPageNine_modelPlan_itTools {
  __typename: "PlanITTools";
  id: UUID;
  pNonClaimsBasedPayments: PNonClaimsBasedPaymentsType[];
  pNonClaimsBasedPaymentsOther: string | null;
  pNonClaimsBasedPaymentsNote: string | null;
  pSharedSavingsPlan: PSharedSavingsPlanType[];
  pSharedSavingsPlanOther: string | null;
  pSharedSavingsPlanNote: string | null;
  pRecoverPayments: PRecoverPaymentsType[];
  pRecoverPaymentsOther: string | null;
  pRecoverPaymentsNote: string | null;
}

export interface GetITToolPageNine_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  payments: GetITToolPageNine_modelPlan_payments;
  itTools: GetITToolPageNine_modelPlan_itTools;
}

export interface GetITToolPageNine {
  modelPlan: GetITToolPageNine_modelPlan;
}

export interface GetITToolPageNineVariables {
  id: UUID;
}
