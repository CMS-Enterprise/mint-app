/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OperationalSolutionKey, OperationalSolutionChanges } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateOperationalSolution
// ====================================================

export interface CreateOperationalSolution_createOperationalSolution {
  __typename: "OperationalSolution";
  id: UUID;
  nameOther: string | null;
  needed: boolean | null;
  key: OperationalSolutionKey | null;
}

export interface CreateOperationalSolution {
  createOperationalSolution: CreateOperationalSolution_createOperationalSolution;
}

export interface CreateOperationalSolutionVariables {
  operationalNeedID: UUID;
  solutionType?: OperationalSolutionKey | null;
  changes: OperationalSolutionChanges;
}
