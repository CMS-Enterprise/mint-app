/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DatabaseOperation } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetRecentChanges
// ====================================================

export interface GetRecentChanges_translatedAuditCollection_translatedFields {
  __typename: "TranslatedAuditField";
  id: UUID;
}

export interface GetRecentChanges_translatedAuditCollection {
  __typename: "TranslatedAudit";
  id: UUID;
  tableName: string;
  date: Time;
  action: DatabaseOperation;
  /**
   * The specific fields that were changed by the transaction
   */
  translatedFields: GetRecentChanges_translatedAuditCollection_translatedFields[];
  actorName: string;
}

export interface GetRecentChanges {
  translatedAuditCollection: GetRecentChanges_translatedAuditCollection[] | null;
}

export interface GetRecentChangesVariables {
  modelPlanID: UUID;
}
