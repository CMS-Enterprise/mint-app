/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TeamRole } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: DeleteModelPlanCollaborator
// ====================================================

export interface DeleteModelPlanCollaborator_deletePlanCollaborator {
  __typename: "PlanCollaborator";
  id: UUID;
  fullName: string;
  teamRole: TeamRole;
  euaUserID: string;
  modelPlanID: UUID;
}

export interface DeleteModelPlanCollaborator {
  deletePlanCollaborator: DeleteModelPlanCollaborator_deletePlanCollaborator;
}

export interface DeleteModelPlanCollaboratorVariables {
  id: UUID;
}
