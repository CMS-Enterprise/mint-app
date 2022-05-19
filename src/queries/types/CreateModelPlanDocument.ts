/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanDocumentInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateModelPlanDocument
// ====================================================

export interface CreateModelPlanDocument_createPlanDocument_document {
  __typename: "PlanDocument";
  id: UUID;
}

export interface CreateModelPlanDocument_createPlanDocument {
  __typename: "PlanDocumentPayload";
  document: CreateModelPlanDocument_createPlanDocument_document | null;
  presignedURL: string | null;
}

export interface CreateModelPlanDocument {
  createPlanDocument: CreateModelPlanDocument_createPlanDocument | null;
}

export interface CreateModelPlanDocumentVariables {
  input: PlanDocumentInput;
}
