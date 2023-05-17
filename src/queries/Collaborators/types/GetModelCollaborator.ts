/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TeamRole } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetModelCollaborator
// ====================================================

export interface GetModelCollaborator_planCollaboratorByID_userAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
  email: string;
  username: string;
}

export interface GetModelCollaborator_planCollaboratorByID {
  __typename: "PlanCollaborator";
  id: UUID;
  userAccount: GetModelCollaborator_planCollaboratorByID_userAccount;
  userID: UUID;
  teamRole: TeamRole;
}

export interface GetModelCollaborator {
  planCollaboratorByID: GetModelCollaborator_planCollaboratorByID;
}

export interface GetModelCollaboratorVariables {
  id: UUID;
}
