/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchOktaUsers
// ====================================================

export interface SearchOktaUsers_searchOktaUsers {
  __typename: "UserInfo";
  displayName: string;
  username: string;
  email: string;
}

export interface SearchOktaUsers {
  searchOktaUsers: SearchOktaUsers_searchOktaUsers[];
}

export interface SearchOktaUsersVariables {
  searchTerm: string;
}
