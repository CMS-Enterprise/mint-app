/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelLearningSystemType, PayType, OelEducateBeneficiariesType, PMakeClaimsPaymentsType, PInformFfsType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetITToolPageEight
// ====================================================

export interface GetITToolPageEight_modelPlan_opsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  id: UUID;
  modelLearningSystems: ModelLearningSystemType[];
}

export interface GetITToolPageEight_modelPlan_payments {
  __typename: "PlanPayments";
  id: UUID;
  payType: PayType[];
  shouldAnyProvidersExcludedFFSSystems: boolean | null;
}

export interface GetITToolPageEight_modelPlan_itTools {
  __typename: "PlanITTools";
  id: UUID;
  oelEducateBeneficiaries: OelEducateBeneficiariesType[];
  oelEducateBeneficiariesOther: string | null;
  oelEducateBeneficiariesNote: string | null;
  pMakeClaimsPayments: PMakeClaimsPaymentsType[];
  pMakeClaimsPaymentsOther: string | null;
  pMakeClaimsPaymentsNote: string | null;
  pInformFfs: PInformFfsType[];
  pInformFfsOther: string | null;
  pInformFfsNote: string | null;
}

export interface GetITToolPageEight_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  opsEvalAndLearning: GetITToolPageEight_modelPlan_opsEvalAndLearning;
  payments: GetITToolPageEight_modelPlan_payments;
  itTools: GetITToolPageEight_modelPlan_itTools;
}

export interface GetITToolPageEight {
  modelPlan: GetITToolPageEight_modelPlan;
}

export interface GetITToolPageEightVariables {
  id: UUID;
}
