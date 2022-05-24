/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GeneratePresignedUploadURLInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: GeneratePresignedUploadURL
// ====================================================

export interface GeneratePresignedUploadURL_generatePresignedUploadURL {
  __typename: "GeneratePresignedUploadURLPayload";
  url: string | null;
}

export interface GeneratePresignedUploadURL {
  generatePresignedUploadURL: GeneratePresignedUploadURL_generatePresignedUploadURL;
}

export interface GeneratePresignedUploadURLVariables {
  input: GeneratePresignedUploadURLInput;
}
