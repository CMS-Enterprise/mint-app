/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetInvolvements
// ====================================================

export interface GetInvolvements_modelPlan_generalCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  id: UUID;
  careCoordinationInvolved: boolean | null;
  careCoordinationInvolvedDescription: string | null;
  careCoordinationInvolvedNote: string | null;
  additionalServicesInvolved: boolean | null;
  additionalServicesInvolvedDescription: string | null;
  additionalServicesInvolvedNote: string | null;
  communityPartnersInvolved: boolean | null;
  communityPartnersInvolvedDescription: string | null;
  communityPartnersInvolvedNote: string | null;
}

export interface GetInvolvements_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  generalCharacteristics: GetInvolvements_modelPlan_generalCharacteristics;
}

export interface GetInvolvements {
  modelPlan: GetInvolvements_modelPlan;
}

export interface GetInvolvementsVariables {
  id: UUID;
}
