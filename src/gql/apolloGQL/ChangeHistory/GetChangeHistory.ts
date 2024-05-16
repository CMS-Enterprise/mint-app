import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetChangeHistory($modelPlanID: UUID!) {
    translatedAuditCollection(modelPlanID: $modelPlanID) {
      id
      tableName
      date
      action
      actorName
      translatedFields {
        id
        changeType
        dataType
        fieldName
        fieldNameTranslated
        referenceLabel
        questionType
        notApplicableQuestions
        old
        oldTranslated
        new
        newTranslated
      }
      metaData {
        ... on TranslatedAuditMetaBaseStruct {
          version
          tableName
        }
        ... on TranslatedAuditMetaGeneric {
          version
          tableName
          relation
          relationContent
        }
      }
    }
  }
`);
