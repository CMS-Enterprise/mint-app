/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TeamRole } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetIndividualModelPlanCollaborator
// ====================================================

export interface GetIndividualModelPlanCollaborator_planCollaboratorByID_userAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
  email: string;
  username: string;
}

export interface GetIndividualModelPlanCollaborator_planCollaboratorByID {
  __typename: "PlanCollaborator";
  id: UUID;
  userAccount: GetIndividualModelPlanCollaborator_planCollaboratorByID_userAccount;
  userID: UUID;
  teamRoles: TeamRole[];
}

export interface GetIndividualModelPlanCollaborator {
  planCollaboratorByID: GetIndividualModelPlanCollaborator_planCollaboratorByID;
}

export interface GetIndividualModelPlanCollaboratorVariables {
  id: UUID;
}
