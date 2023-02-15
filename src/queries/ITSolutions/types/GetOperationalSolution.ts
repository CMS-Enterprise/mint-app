/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OperationalSolutionKey, OpSolutionStatus, DocumentType } from "./../../../types/graphql-global-types";

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
  mustFinishDts: Time | null;
  mustStartDts: Time | null;
  documents: GetOperationalSolution_operationalSolution_documents[];
}

export interface GetOperationalSolution {
  operationalSolution: GetOperationalSolution_operationalSolution;
}

export interface GetOperationalSolutionVariables {
  id: UUID;
}
