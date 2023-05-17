/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OperationalNeedKey } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateCustomOperationalNeedById
// ====================================================

export interface UpdateCustomOperationalNeedById_updateCustomOperationalNeedByID {
  __typename: "OperationalNeed";
  id: UUID;
  nameOther: string | null;
  needed: boolean | null;
  key: OperationalNeedKey | null;
}

export interface UpdateCustomOperationalNeedById {
  updateCustomOperationalNeedByID: UpdateCustomOperationalNeedById_updateCustomOperationalNeedByID;
}

export interface UpdateCustomOperationalNeedByIdVariables {
  id: UUID;
  customNeedType: string;
  needed: boolean;
}
