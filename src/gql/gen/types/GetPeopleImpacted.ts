/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ConfidenceType, SelectionMethodType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetPeopleImpacted
// ====================================================

export interface GetPeopleImpacted_modelPlan_beneficiaries {
  __typename: "PlanBeneficiaries";
  id: UUID;
  numberPeopleImpacted: number | null;
  estimateConfidence: ConfidenceType | null;
  confidenceNote: string | null;
  beneficiarySelectionNote: string | null;
  beneficiarySelectionOther: string | null;
  beneficiarySelectionMethod: SelectionMethodType[];
}

export interface GetPeopleImpacted_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  beneficiaries: GetPeopleImpacted_modelPlan_beneficiaries;
}

export interface GetPeopleImpacted {
  modelPlan: GetPeopleImpacted_modelPlan;
}

export interface GetPeopleImpactedVariables {
  id: UUID;
}
