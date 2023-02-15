/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AuthorityAllowance, WaiverType, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetAuthority
// ====================================================

export interface GetAuthority_modelPlan_generalCharacteristics_readyForReviewByUserAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
}

export interface GetAuthority_modelPlan_generalCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  id: UUID;
  rulemakingRequired: boolean | null;
  rulemakingRequiredDescription: string | null;
  rulemakingRequiredNote: string | null;
  authorityAllowances: AuthorityAllowance[];
  authorityAllowancesOther: string | null;
  authorityAllowancesNote: string | null;
  waiversRequired: boolean | null;
  waiversRequiredTypes: WaiverType[];
  waiversRequiredNote: string | null;
  readyForReviewByUserAccount: GetAuthority_modelPlan_generalCharacteristics_readyForReviewByUserAccount | null;
  readyForReviewDts: Time | null;
  status: TaskStatus;
}

export interface GetAuthority_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  generalCharacteristics: GetAuthority_modelPlan_generalCharacteristics;
}

export interface GetAuthority {
  modelPlan: GetAuthority_modelPlan;
}

export interface GetAuthorityVariables {
  id: UUID;
}
