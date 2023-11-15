/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanDocumentLinkInput } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: LinkNewPlanDocument
// ====================================================

export interface LinkNewPlanDocument_linkNewPlanDocument {
  __typename: "PlanDocument";
  id: UUID;
}

export interface LinkNewPlanDocument {
  linkNewPlanDocument: LinkNewPlanDocument_linkNewPlanDocument;
}

export interface LinkNewPlanDocumentVariables {
  input: PlanDocumentLinkInput;
}
