/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OperationalSolutionChanges, OperationalSolutionKey } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateCustomOperationalSolution
// ====================================================

export interface UpdateCustomOperationalSolution_addOrUpdateCustomOperationalSolution {
  __typename: "OperationalSolution";
  id: UUID;
  nameOther: string | null;
  needed: boolean | null;
  key: OperationalSolutionKey | null;
}

export interface UpdateCustomOperationalSolution {
  addOrUpdateCustomOperationalSolution: UpdateCustomOperationalSolution_addOrUpdateCustomOperationalSolution;
}

export interface UpdateCustomOperationalSolutionVariables {
  operationalNeedID: UUID;
  customSolutionType: string;
  changes: OperationalSolutionChanges;
}
