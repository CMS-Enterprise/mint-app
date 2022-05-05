/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanCollaboratorInput, TeamRole } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateModelPlanCollaborator
// ====================================================

export interface CreateModelPlanCollaborator_createPlanCollaborator {
  __typename: "PlanCollaborator";
  fullName: string;
  teamRole: TeamRole;
  euaUserID: string;
  modelPlanID: UUID;
}

export interface CreateModelPlanCollaborator {
  createPlanCollaborator: CreateModelPlanCollaborator_createPlanCollaborator | null;
}

export interface CreateModelPlanCollaboratorVariables {
  input: PlanCollaboratorInput;
}
