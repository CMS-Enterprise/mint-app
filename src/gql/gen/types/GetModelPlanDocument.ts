/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DocumentType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetModelPlanDocument
// ====================================================

export interface GetModelPlanDocument_planDocument {
  __typename: "PlanDocument";
  id: UUID;
  modelPlanID: UUID;
  fileType: string;
  bucket: string;
  fileKey: string;
  virusScanned: boolean;
  virusClean: boolean;
  fileName: string;
  fileSize: number;
  restricted: boolean;
  documentType: DocumentType;
  otherType: string | null;
  createdDts: Time;
}

export interface GetModelPlanDocument {
  planDocument: GetModelPlanDocument_planDocument;
}

export interface GetModelPlanDocumentVariables {
  id: UUID;
}
