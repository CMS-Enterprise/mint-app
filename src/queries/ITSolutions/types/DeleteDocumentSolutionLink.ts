/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteDocumentSolutionLink
// ====================================================

export interface DeleteDocumentSolutionLink {
  removePlanDocumentSolutionLinks: boolean;
}

export interface DeleteDocumentSolutionLinkVariables {
  solutionID: UUID;
  documentIDs: UUID[];
}
