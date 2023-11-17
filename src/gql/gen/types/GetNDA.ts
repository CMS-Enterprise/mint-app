/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetNDA
// ====================================================

export interface GetNDA_ndaInfo {
  __typename: "NDAInfo";
  agreed: boolean;
  agreedDts: Time | null;
}

export interface GetNDA {
  ndaInfo: GetNDA_ndaInfo;
}
