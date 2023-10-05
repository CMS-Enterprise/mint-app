import { graphql } from 'gql/gen/gql';

export default graphql(/* GraphQL */ `
  mutation UpdatePlanBasics($id: UUID!, $changes: PlanBasicsChanges!) {
    updatePlanBasics(id: $id, changes: $changes) {
      id
    }
  }
`);
