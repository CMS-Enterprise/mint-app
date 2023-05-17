/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OperationalNeedKey } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateCustomOperationalNeed
// ====================================================

export interface UpdateCustomOperationalNeed_addOrUpdateCustomOperationalNeed {
  __typename: "OperationalNeed";
  id: UUID;
  nameOther: string | null;
  needed: boolean | null;
  key: OperationalNeedKey | null;
}

export interface UpdateCustomOperationalNeed {
  addOrUpdateCustomOperationalNeed: UpdateCustomOperationalNeed_addOrUpdateCustomOperationalNeed;
}

export interface UpdateCustomOperationalNeedVariables {
  modelPlanID: UUID;
  customNeedType: string;
  needed: boolean;
}
