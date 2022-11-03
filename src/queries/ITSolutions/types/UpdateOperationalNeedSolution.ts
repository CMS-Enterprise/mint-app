/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OperationalSolutionKey, OperationalSolutionChanges } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateOperationalNeedSolution
// ====================================================

export interface UpdateOperationalNeedSolution_addOrUpdateOperationalSolution {
  __typename: "OperationalSolution";
  id: UUID;
  needed: boolean | null;
  key: OperationalSolutionKey | null;
}

export interface UpdateOperationalNeedSolution {
  addOrUpdateOperationalSolution: UpdateOperationalNeedSolution_addOrUpdateOperationalSolution;
}

export interface UpdateOperationalNeedSolutionVariables {
  operationalNeedID: UUID;
  solutionType: OperationalSolutionKey;
  changes: OperationalSolutionChanges;
}
