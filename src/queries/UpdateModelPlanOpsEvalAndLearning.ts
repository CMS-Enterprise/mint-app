import { gql } from '@apollo/client';

export default gql`
  mutation UpdateModelPlanOpsEvalAndLearning(
    $id: UUID!
    $changes: PlanOpsEvalAndLearningChanges!
  ) {
    updatePlanOpsEvalAndLearning(id: $id, changes: $changes) {
      id
    }
  }
`;
