import { graphql } from '../../gen/gql';

export default graphql(/* GraphQL */ `
  mutation UpdatePayments($id: UUID!, $changes: PlanPaymentsChanges!) {
    updatePlanPayments(id: $id, changes: $changes) {
      id
    }
  }
`);
