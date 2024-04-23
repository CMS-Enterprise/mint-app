/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DatabaseOperation, AuditFieldChangeType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: translatedAuditCollection
// ====================================================

export interface translatedAuditCollection_translatedAuditCollection_translatedFields_metaData {
  __typename: "TranslatedAuditFieldMetaBaseStruct";
  version: number;
}

export interface translatedAuditCollection_translatedAuditCollection_translatedFields {
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
  metaData: translatedAuditCollection_translatedAuditCollection_translatedFields_metaData;
}

export interface translatedAuditCollection_translatedAuditCollection_metaData {
  __typename: "TranslatedAuditMetaBaseStruct";
  version: number;
  tableName: string | null;
}

export interface translatedAuditCollection_translatedAuditCollection {
  __typename: "TranslatedAudit";
  id: UUID;
  modelName: string;
  tableID: number;
  tableName: string;
  primaryKey: UUID;
  date: Time;
  action: DatabaseOperation;
  /**
   * The specific fields that were changed by the transaction
   */
  translatedFields: translatedAuditCollection_translatedAuditCollection_translatedFields[];
  actorID: UUID;
  actorName: string;
  changeID: number;
  metaData: translatedAuditCollection_translatedAuditCollection_metaData;
}

export interface translatedAuditCollection {
  translatedAuditCollection: translatedAuditCollection_translatedAuditCollection[] | null;
}

export interface translatedAuditCollectionVariables {
  modelPlanID: UUID;
}
