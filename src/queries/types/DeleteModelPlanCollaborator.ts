/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanCollaboratorInput, TeamRole, CMSCenter } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: DeleteModelPlanCollaborator
// ====================================================

export interface DeleteModelPlanCollaborator_deletePlanCollaborator {
  __typename: "PlanCollaborator";
  fullName: string;
  teamRole: TeamRole;
  euaUserID: string;
  cmsCenter: CMSCenter;
  modelPlanID: UUID;
}

export interface DeleteModelPlanCollaborator {
  deletePlanCollaborator: DeleteModelPlanCollaborator_deletePlanCollaborator | null;
}

export interface DeleteModelPlanCollaboratorVariables {
  input: PlanCollaboratorInput;
}
