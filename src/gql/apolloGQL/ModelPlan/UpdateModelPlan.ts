import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateModelPlan($id: UUID!, $changes: ModelPlanChanges!) {
    updateModelPlan(id: $id, changes: $changes) {
      id
    }
  }
`);
