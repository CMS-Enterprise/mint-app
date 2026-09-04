import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateTaskStatus(
    $modelPlanID: UUID!
    $key: PlanTaskKey!
    $isComplete: Boolean!
  ) {
    markPlanTaskComplete(
      modelPlanID: $modelPlanID
      key: $key
      isComplete: $isComplete
    ) {
      id
      key
      status
      state
      completedBy
      completedByUserAccount {
        id
        username
      }
      completedDts
    }
  }
`);
