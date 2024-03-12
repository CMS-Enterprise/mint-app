/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TeamRole } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateModelPlanCollaborator
// ====================================================

export interface UpdateModelPlanCollaborator_updatePlanCollaborator_userAccount {
  __typename: "UserAccount";
  commonName: string;
  email: string;
  username: string;
}

export interface UpdateModelPlanCollaborator_updatePlanCollaborator {
  __typename: "PlanCollaborator";
  teamRoles: TeamRole[];
  userAccount: UpdateModelPlanCollaborator_updatePlanCollaborator_userAccount;
  userID: UUID;
  modelPlanID: UUID;
}

export interface UpdateModelPlanCollaborator {
  updatePlanCollaborator: UpdateModelPlanCollaborator_updatePlanCollaborator;
}

export interface UpdateModelPlanCollaboratorVariables {
  id: UUID;
  newRole: TeamRole[];
}
