/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BeneficiariesType, TriStateAnswer, ConfidenceType, SelectionMethodType, FrequencyType, OverlapType, YesNoType, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetAllBeneficiaries
// ====================================================

export interface GetAllBeneficiaries_modelPlan_beneficiaries {
  __typename: "PlanBeneficiaries";
  id: UUID;
  modelPlanID: UUID;
  beneficiaries: BeneficiariesType[];
  diseaseSpecificGroup: string | null;
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
  beneficiarySelectionMethod: SelectionMethodType[];
  beneficiarySelectionOther: string | null;
  beneficiarySelectionNote: string | null;
  beneficiarySelectionFrequency: FrequencyType | null;
  beneficiarySelectionFrequencyOther: string | null;
  beneficiarySelectionFrequencyNote: string | null;
  beneficiaryOverlap: OverlapType | null;
  beneficiaryOverlapNote: string | null;
  precedenceRules: YesNoType[];
  precedenceRulesYes: string | null;
  precedenceRulesNo: string | null;
  precedenceRulesNote: string | null;
  status: TaskStatus;
}

export interface GetAllBeneficiaries_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  beneficiaries: GetAllBeneficiaries_modelPlan_beneficiaries;
}

export interface GetAllBeneficiaries {
  modelPlan: GetAllBeneficiaries_modelPlan;
}

export interface GetAllBeneficiariesVariables {
  id: UUID;
}
