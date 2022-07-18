/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CcmInvolvmentType, AgencyOrStateHelpType, StakeholdersType, ContractorSupportType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetOpsEvalAndLearning
// ====================================================

export interface GetOpsEvalAndLearning_modelPlan_opsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  id: UUID;
  ccmInvolvment: CcmInvolvmentType[];
  agencyOrStateHelp: AgencyOrStateHelpType[];
  agencyOrStateHelpOther: string | null;
  agencyOrStateHelpNote: string | null;
  stakeholders: StakeholdersType[];
  stakeholdersOther: string | null;
  stakeholdersNote: string | null;
  helpdeskUse: boolean | null;
  helpdeskUseNote: string | null;
  contractorSupport: ContractorSupportType[];
  contractorSupportOther: string | null;
  contractorSupportHow: string | null;
  contractorSupportNote: string | null;
  iddocSupport: boolean | null;
  iddocSupportNote: string | null;
}

export interface GetOpsEvalAndLearning_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  opsEvalAndLearning: GetOpsEvalAndLearning_modelPlan_opsEvalAndLearning;
}

export interface GetOpsEvalAndLearning {
  modelPlan: GetOpsEvalAndLearning_modelPlan;
}

export interface GetOpsEvalAndLearningVariables {
  id: UUID;
}
