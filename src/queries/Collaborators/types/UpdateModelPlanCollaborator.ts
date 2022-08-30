/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TeamRole } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateModelPlanCollaborator
// ====================================================

export interface UpdateModelPlanCollaborator_updatePlanCollaborator {
  __typename: "PlanCollaborator";
  fullName: string;
  teamRole: TeamRole;
  email: string;
  euaUserID: string;
  modelPlanID: UUID;
}

export interface UpdateModelPlanCollaborator {
  updatePlanCollaborator: UpdateModelPlanCollaborator_updatePlanCollaborator;
}

export interface UpdateModelPlanCollaboratorVariables {
  id: UUID;
  newRole: TeamRole;
}
