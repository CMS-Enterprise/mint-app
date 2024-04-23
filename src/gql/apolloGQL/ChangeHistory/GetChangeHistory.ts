import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query translatedAuditCollection($modelPlanID: UUID!) {
    translatedAuditCollection(modelPlanID: $modelPlanID) {
      id
      modelName
      tableID
      tableName
      primaryKey
      date
      action

      translatedFields {
        id

        changeType
        fieldName
        fieldNameTranslated
        old
        oldTranslated
        new
        newTranslated

        metaData {
          ... on TranslatedAuditFieldMetaBaseStruct {
            version
          }
        }
      }

      actorID
      actorName

      changeID
      metaData {
        ... on TranslatedAuditMetaBaseStruct {
          version
          tableName
        }
      }
    }
  }
`);
