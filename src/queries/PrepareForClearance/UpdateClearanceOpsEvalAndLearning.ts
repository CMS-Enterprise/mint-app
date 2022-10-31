import { gql } from '@apollo/client';

export default gql`
  mutation UpdateClearanceOpsEvalAndLearning(
    $id: UUID!
    $changes: PlanOpsEvalAndLearningChanges!
  ) {
    updatePlanOpsEvalAndLearning(id: $id, changes: $changes) {
      readyForClearanceBy
      readyForClearanceDts
      status
    }
  }
`;
