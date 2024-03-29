/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserInfo
// ====================================================

export interface GetUserInfo_userAccount {
  __typename: "UserAccount";
  id: UUID;
  username: string;
  commonName: string;
  email: string;
  givenName: string;
  familyName: string;
}

export interface GetUserInfo {
  userAccount: GetUserInfo_userAccount;
}

export interface GetUserInfoVariables {
  username: string;
}
