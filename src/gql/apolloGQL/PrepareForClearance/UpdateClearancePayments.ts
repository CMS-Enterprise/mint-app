import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateClearancePayments($id: UUID!, $changes: PlanPaymentsChanges!) {
    updatePlanPayments(id: $id, changes: $changes) {
      readyForClearanceByUserAccount {
        id
        commonName
      }
      readyForClearanceDts
      status
    }
  }
`);
