/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateNDA
// ====================================================

export interface UpdateNDA_agreeToNDA {
  __typename: "NDAInfo";
  agreed: boolean;
  agreedDts: Time | null;
}

export interface UpdateNDA {
  agreeToNDA: UpdateNDA_agreeToNDA;
}
