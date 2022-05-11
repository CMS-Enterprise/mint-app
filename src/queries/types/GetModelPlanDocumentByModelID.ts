/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DocumentType } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetModelPlanDocumentByModelID
// ====================================================

export interface GetModelPlanDocumentByModelID_readPlanDocumentByModelID {
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
  optionalNotes: string | null;
  createdDts: Time | null;
}

export interface GetModelPlanDocumentByModelID {
  readPlanDocumentByModelID: (GetModelPlanDocumentByModelID_readPlanDocumentByModelID | null)[] | null;
}

export interface GetModelPlanDocumentByModelIDVariables {
  id: UUID;
}
