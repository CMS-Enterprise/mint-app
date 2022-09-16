/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanDocumentBEInput } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UploadNewPlanDocument
// ====================================================

export interface UploadNewPlanDocument_uploadNewPlanDocument {
  __typename: "PlanDocument";
  id: UUID;
}

export interface UploadNewPlanDocument {
  uploadNewPlanDocument: UploadNewPlanDocument_uploadNewPlanDocument;
}

export interface UploadNewPlanDocumentVariables {
  input: PlanDocumentBEInput;
}
