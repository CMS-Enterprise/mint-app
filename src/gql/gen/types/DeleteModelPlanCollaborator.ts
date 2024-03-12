/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TeamRole } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: DeleteModelPlanCollaborator
// ====================================================

export interface DeleteModelPlanCollaborator_deletePlanCollaborator_userAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
  email: string;
  username: string;
}

export interface DeleteModelPlanCollaborator_deletePlanCollaborator {
  __typename: "PlanCollaborator";
  id: UUID;
  teamRoles: TeamRole[];
  userAccount: DeleteModelPlanCollaborator_deletePlanCollaborator_userAccount;
  userID: UUID;
  modelPlanID: UUID;
}

export interface DeleteModelPlanCollaborator {
  deletePlanCollaborator: DeleteModelPlanCollaborator_deletePlanCollaborator;
}

export interface DeleteModelPlanCollaboratorVariables {
  id: UUID;
}
