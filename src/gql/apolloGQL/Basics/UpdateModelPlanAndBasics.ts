import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateModelPlanAndBasics(
    $id: UUID!
    $changes: ModelPlanChanges!
    $basicsId: UUID!
    $basicsChanges: PlanBasicsChanges!
  ) {
    updateModelPlan(id: $id, changes: $changes) {
      id
    }
    updatePlanBasics(id: $basicsId, changes: $basicsChanges) {
      id
    }
  }
`);
