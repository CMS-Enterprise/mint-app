/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DocumentType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetModelPlanDocuments
// ====================================================

export interface GetModelPlanDocuments_modelPlan_documents {
  __typename: "PlanDocument";
  id: UUID;
  virusScanned: boolean;
  virusClean: boolean;
  fileName: string;
  fileType: string;
  downloadUrl: string | null;
  restricted: boolean;
  documentType: DocumentType;
  createdDts: Time;
  optionalNotes: string | null;
  otherType: string | null;
  numLinkedSolutions: number;
  /**
   * If isLink = true, then this is a URL to a linked document, not an uploaded document
   */
  isLink: boolean;
  /**
   * URL is the link that must be provided if this is a link instead of an uploaded document
   */
  url: string | null;
}

export interface GetModelPlanDocuments_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  isCollaborator: boolean;
  documents: GetModelPlanDocuments_modelPlan_documents[];
}

export interface GetModelPlanDocuments {
  modelPlan: GetModelPlanDocuments_modelPlan;
}

export interface GetModelPlanDocumentsVariables {
  id: UUID;
}
