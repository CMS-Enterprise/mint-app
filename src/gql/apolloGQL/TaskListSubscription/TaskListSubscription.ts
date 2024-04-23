import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  subscription TaskListSubscription($modelPlanID: UUID!) {
    onLockTaskListSectionContext(modelPlanID: $modelPlanID) {
      changeType
      lockStatus {
        modelPlanID
        section
        lockedByUserAccount {
          id
          username
          commonName
        }
        isAssessment
      }
      actionType
    }
  }
`);
