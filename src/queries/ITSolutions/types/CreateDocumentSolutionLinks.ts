/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateDocumentSolutionLinks
// ====================================================

export interface CreateDocumentSolutionLinks_createPlanDocumentSolutionLinks {
  __typename: "PlanDocumentSolutionLink";
  id: UUID;
}

export interface CreateDocumentSolutionLinks {
  createPlanDocumentSolutionLinks: CreateDocumentSolutionLinks_createPlanDocumentSolutionLinks[] | null;
}

export interface CreateDocumentSolutionLinksVariables {
  solutionID: UUID;
  documentIDs: UUID[];
}
