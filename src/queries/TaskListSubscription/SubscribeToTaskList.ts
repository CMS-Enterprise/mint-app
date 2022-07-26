import { gql } from '@apollo/client';

export default gql`
  subscription TaskListSubscription($modelPlanID: UUID!) {
    onTaskListSectionLocksChanged(modelPlanID: $modelPlanID) {
      changeType
      lockStatus {
        modelPlanID
        section
        lockedBy
        refCount
      }
    }
  }
`;
