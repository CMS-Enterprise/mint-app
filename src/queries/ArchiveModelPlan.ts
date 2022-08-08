import { gql } from '@apollo/client';

export default gql`
  mutation ArchiveModelPlan($id: UUID!, $changes: ModelPlanChanges!) {
    updateModelPlan(id: $id, changes: $changes) {
      id
    }
  }
`;
