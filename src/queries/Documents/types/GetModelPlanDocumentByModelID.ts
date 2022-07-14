/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DocumentType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetModelPlanDocumentByModelID
// ====================================================

export interface GetModelPlanDocumentByModelID_readPlanDocumentByModelID {
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
  documentType: DocumentType;
  otherType: string | null;
  optionalNotes: string | null;
  createdDts: Time;
}

export interface GetModelPlanDocumentByModelID {
  readPlanDocumentByModelID: GetModelPlanDocumentByModelID_readPlanDocumentByModelID[];
}

export interface GetModelPlanDocumentByModelIDVariables {
  id: UUID;
}
