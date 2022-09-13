import { gql } from '@apollo/client';

export default gql`
  query GetTaskListSubscriptions($modelPlanID: UUID!) {
    taskListSectionLocks(modelPlanID: $modelPlanID) {
      modelPlanID
      section
      lockedBy
    }
  }
`;
