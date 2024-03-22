import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetTaskListSubscriptions($modelPlanID: UUID!) {
    taskListSectionLocks(modelPlanID: $modelPlanID) {
      modelPlanID
      section
      # lockedBy
      lockedByUserAccount {
        id
        username
        commonName
      }
      isAssessment
    }
  }
`);
