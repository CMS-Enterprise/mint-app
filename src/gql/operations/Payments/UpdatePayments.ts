import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdatePayments($id: UUID!, $changes: PlanPaymentsChanges!) {
    updatePlanPayments(id: $id, changes: $changes) {
      id
    }
  }
`);
