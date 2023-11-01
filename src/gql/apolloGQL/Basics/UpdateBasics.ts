import { graphql } from '../../gen/gql';

export default graphql(/* GraphQL */ `
  mutation UpdateBasics($id: UUID!, $changes: PlanBasicsChanges!) {
    updatePlanBasics(id: $id, changes: $changes) {
      id
    }
  }
`);
