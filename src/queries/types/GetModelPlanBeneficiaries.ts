/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BeneficiariesType, TriStateAnswer, ConfidenceType, SelectionMethodType, FrequencyType, OverlapType, TaskStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetModelPlanBeneficiaries
// ====================================================

export interface GetModelPlanBeneficiaries_modelPlan_beneficiaries {
  __typename: "PlanBeneficiaries";
  id: UUID;
  modelPlanID: UUID;
  beneficiaries: BeneficiariesType[];
  beneficiariesOther: string | null;
  beneficiariesNote: string | null;
  treatDualElligibleDifferent: TriStateAnswer | null;
  treatDualElligibleDifferentHow: string | null;
  treatDualElligibleDifferentNote: string | null;
  excludeCertainCharacteristics: TriStateAnswer | null;
  excludeCertainCharacteristicsCriteria: string | null;
  excludeCertainCharacteristicsNote: string | null;
  numberPeopleImpacted: number | null;
  estimateConfidence: ConfidenceType | null;
  confidenceNote: string | null;
  beneficiarySelectionNote: string | null;
  beneficiarySelectionOther: string | null;
  beneficiarySelectionMethod: SelectionMethodType[];
  beneficiarySelectionFrequency: FrequencyType | null;
  beneficiarySelectionFrequencyNote: string | null;
  beneficiarySelectionFrequencyOther: string | null;
  beneficiaryOverlap: OverlapType | null;
  beneficiaryOverlapNote: string | null;
  precedenceRules: string | null;
  createdBy: string;
  createdDts: Time;
  modifiedBy: string | null;
  modifiedDts: Time | null;
  status: TaskStatus;
}

export interface GetModelPlanBeneficiaries_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  beneficiaries: GetModelPlanBeneficiaries_modelPlan_beneficiaries;
}

export interface GetModelPlanBeneficiaries {
  modelPlan: GetModelPlanBeneficiaries_modelPlan;
}

export interface GetModelPlanBeneficiariesVariables {
  id: UUID;
}
