import { gql } from '@apollo/client';

export default gql`
  subscription TaskListSubscription($modelPlanID: UUID!) {
    onLockTaskListSectionContext(modelPlanID: $modelPlanID) {
      changeType
      lockStatus {
        modelPlanID
        section
        lockedBy
      }
      actionType
    }
  }
`;
