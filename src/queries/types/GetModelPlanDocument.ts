/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DocumentType } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetModelPlanDocument
// ====================================================

export interface GetModelPlanDocument_planDocument {
  __typename: "PlanDocument";
  id: UUID;
  modelPlanID: UUID;
  fileType: string | null;
  bucket: string | null;
  fileKey: string | null;
  virusScanned: boolean | null;
  virusClean: boolean | null;
  fileName: string | null;
  fileSize: number | null;
  documentType: DocumentType | null;
  otherType: string | null;
  createdDts: Time;
}

export interface GetModelPlanDocument {
  planDocument: GetModelPlanDocument_planDocument | null;
}

export interface GetModelPlanDocumentVariables {
  id: UUID;
}
