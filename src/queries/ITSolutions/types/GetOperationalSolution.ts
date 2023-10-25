/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OperationalSolutionKey, OpSolutionStatus, DocumentType, OperationalSolutionSubtaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetOperationalSolution
// ====================================================

export interface GetOperationalSolution_operationalSolution_documents {
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

export interface GetOperationalSolution_operationalSolution_operationalSolutionSubtasks {
  __typename: "OperationalSolutionSubtask";
  id: UUID;
  name: string;
  status: OperationalSolutionSubtaskStatus;
}

export interface GetOperationalSolution_operationalSolution {
  __typename: "OperationalSolution";
  id: UUID;
  key: OperationalSolutionKey | null;
  needed: boolean | null;
  name: string | null;
  nameOther: string | null;
  pocName: string | null;
  pocEmail: string | null;
  status: OpSolutionStatus;
  isOther: boolean;
  isCommonSolution: boolean;
  otherHeader: string | null;
  mustFinishDts: Time | null;
  mustStartDts: Time | null;
  documents: GetOperationalSolution_operationalSolution_documents[];
  operationalSolutionSubtasks: GetOperationalSolution_operationalSolution_operationalSolutionSubtasks[];
}

export interface GetOperationalSolution {
  operationalSolution: GetOperationalSolution_operationalSolution;
}

export interface GetOperationalSolutionVariables {
  id: UUID;
}
