/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TeamRole } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetModelCollaborator
// ====================================================

export interface GetModelCollaborator_planCollaboratorByID {
  __typename: "PlanCollaborator";
  id: UUID;
  fullName: string;
  euaUserID: string;
  teamRole: TeamRole;
  modelPlanID: UUID;
  createdDts: Time | null;
}

export interface GetModelCollaborator {
  planCollaboratorByID: GetModelCollaborator_planCollaboratorByID;
}

export interface GetModelCollaboratorVariables {
  id: UUID;
}
