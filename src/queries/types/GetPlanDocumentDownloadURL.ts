/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPlanDocumentDownloadURL
// ====================================================

export interface GetPlanDocumentDownloadURL_planDocumentDownloadURL_document {
  __typename: "PlanDocument";
  id: UUID;
}

export interface GetPlanDocumentDownloadURL_planDocumentDownloadURL {
  __typename: "PlanDocumentPayload";
  document: GetPlanDocumentDownloadURL_planDocumentDownloadURL_document | null;
  presignedURL: string | null;
}

export interface GetPlanDocumentDownloadURL {
  planDocumentDownloadURL: GetPlanDocumentDownloadURL_planDocumentDownloadURL;
}

export interface GetPlanDocumentDownloadURLVariables {
  id: UUID;
}
