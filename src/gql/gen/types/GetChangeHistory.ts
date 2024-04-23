/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DatabaseOperation, AuditFieldChangeType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetChangeHistory
// ====================================================

export interface GetChangeHistory_translatedAuditCollection_translatedFields_metaData {
  __typename: "TranslatedAuditFieldMetaBaseStruct";
  version: number;
}

export interface GetChangeHistory_translatedAuditCollection_translatedFields {
  __typename: "TranslatedAuditField";
  id: UUID;
  /**
   * This represents whether a field was answered, updated, or had the answer removed
   */
  changeType: AuditFieldChangeType;
  fieldName: string;
  fieldNameTranslated: string;
  old: Any | null;
  oldTranslated: Any | null;
  new: Any | null;
  newTranslated: Any | null;
  metaData: GetChangeHistory_translatedAuditCollection_translatedFields_metaData;
}

export interface GetChangeHistory_translatedAuditCollection {
  __typename: "TranslatedAudit";
  id: UUID;
  tableName: string;
  date: Time;
  action: DatabaseOperation;
  /**
   * The specific fields that were changed by the transaction
   */
  translatedFields: GetChangeHistory_translatedAuditCollection_translatedFields[];
  actorName: string;
}

export interface GetChangeHistory {
  translatedAuditCollection: GetChangeHistory_translatedAuditCollection[] | null;
}

export interface GetChangeHistoryVariables {
  modelPlanID: UUID;
}
