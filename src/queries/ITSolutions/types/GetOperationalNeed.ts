/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OperationalNeedKey, OperationalSolutionKey } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetOperationalNeed
// ====================================================

export interface GetOperationalNeed_operationalNeed_solutions {
  __typename: "OperationalSolution";
  id: UUID;
  name: string | null;
  key: OperationalSolutionKey | null;
  pocName: string | null;
  pocEmail: string | null;
  needed: boolean | null;
  nameOther: string | null;
}

export interface GetOperationalNeed_operationalNeed {
  __typename: "OperationalNeed";
  id: UUID;
  modelPlanID: UUID;
  name: string | null;
  key: OperationalNeedKey | null;
  nameOther: string | null;
  needed: boolean | null;
  solutions: GetOperationalNeed_operationalNeed_solutions[];
}

export interface GetOperationalNeed {
  operationalNeed: GetOperationalNeed_operationalNeed;
}

export interface GetOperationalNeedVariables {
  id: UUID;
}
