/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DiscussionUserRole } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetMostRecentRoleSelection
// ====================================================

export interface GetMostRecentRoleSelection_mostRecentDiscussionRoleSelection {
  __typename: "DiscussionRoleSelection";
  userRole: DiscussionUserRole;
  userRoleDescription: string | null;
}

export interface GetMostRecentRoleSelection {
  mostRecentDiscussionRoleSelection: GetMostRecentRoleSelection_mostRecentDiscussionRoleSelection | null;
}
