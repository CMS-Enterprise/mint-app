/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PayType, ClaimsBasedPayType, ComplexityCalculationLevelType, FrequencyType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetComplexity
// ====================================================

export interface GetComplexity_modelPlan_payments {
  __typename: "PlanPayments";
  id: UUID;
  payType: PayType[];
  payClaims: ClaimsBasedPayType[];
  expectedCalculationComplexityLevel: ComplexityCalculationLevelType | null;
  expectedCalculationComplexityLevelNote: string | null;
  canParticipantsSelectBetweenPaymentMechanisms: boolean | null;
  canParticipantsSelectBetweenPaymentMechanismsHow: string | null;
  canParticipantsSelectBetweenPaymentMechanismsNote: string | null;
  anticipatedPaymentFrequency: FrequencyType[];
  anticipatedPaymentFrequencyOther: string | null;
  anticipatedPaymentFrequencyNote: string | null;
}

export interface GetComplexity_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  payments: GetComplexity_modelPlan_payments;
}

export interface GetComplexity {
  modelPlan: GetComplexity_modelPlan;
}

export interface GetComplexityVariables {
  id: UUID;
}
