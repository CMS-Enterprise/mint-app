import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateBasics($id: UUID!, $changes: PlanBasicsChanges!) {
    updatePlanBasics(id: $id, changes: $changes) {
      id
    }
  }
`);
