import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdatePlanOpsEvalAndLearning(
    $id: UUID!
    $changes: PlanOpsEvalAndLearningChanges!
  ) {
    updatePlanOpsEvalAndLearning(id: $id, changes: $changes) {
      id
    }
  }
`);
