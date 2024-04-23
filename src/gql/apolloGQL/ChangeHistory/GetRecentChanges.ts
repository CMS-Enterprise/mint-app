import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetRecentChanges($modelPlanID: UUID!) {
    translatedAuditCollection(modelPlanID: $modelPlanID) {
      id
      tableName
      date
      action

      translatedFields {
        id
      }

      actorName
    }
  }
`);
