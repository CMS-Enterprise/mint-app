import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetChangeHistory($modelPlanID: UUID!) {
    translatedAuditCollection(modelPlanID: $modelPlanID) {
      id
      tableName
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

      actorName
    }
  }
`);
