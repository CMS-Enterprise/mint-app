/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCedarUser
// ====================================================

export interface GetCedarUser_cedarPersonsByCommonName {
  __typename: "UserInfo";
  email: string;
  commonName: string;
  euaUserId: string;
}

export interface GetCedarUser {
  cedarPersonsByCommonName: GetCedarUser_cedarPersonsByCommonName[];
}

export interface GetCedarUserVariables {
  commonName: string;
}
