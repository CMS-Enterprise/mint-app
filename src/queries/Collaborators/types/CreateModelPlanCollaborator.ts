/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanCollaboratorCreateInput, TeamRole } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateModelPlanCollaborator
// ====================================================

export interface CreateModelPlanCollaborator_createPlanCollaborator_userAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
  email: string;
}

export interface CreateModelPlanCollaborator_createPlanCollaborator {
  __typename: "PlanCollaborator";
  teamRoles: TeamRole[];
  userAccount: CreateModelPlanCollaborator_createPlanCollaborator_userAccount;
  userID: UUID;
  modelPlanID: UUID;
}

export interface CreateModelPlanCollaborator {
  createPlanCollaborator: CreateModelPlanCollaborator_createPlanCollaborator;
}

export interface CreateModelPlanCollaboratorVariables {
  input: PlanCollaboratorCreateInput;
}
